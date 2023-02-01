import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { asapScheduler, async, lastValueFrom } from 'rxjs';
import { Block } from 'src/app/models/block';
import { Task } from 'src/app/models/task';
import { HttpService } from 'src/app/services/http-service/http.service';

const sleepTime = 300;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const cloneBlock = (block: Block) => {
  let clone: Block = {
    type: block.type,
    text: block.text,
    color: block.color,
    include: [],
  }

  if (block.numberofRepeates) {
    clone.numberofRepeates = block.numberofRepeates
  }
  return clone
}

@Component({
  selector: 'app-solve-page',
  templateUrl: './solve-page.component.html',
  styleUrls: ['./solve-page.component.css'],
  animations: [
    trigger('horizontal', [
      state('*',
        style(
          { marginLeft: '{{x}}%' }
        ),
        {
          params: {
            x: 0
          }
        }
      ),
      transition("*=>*", animate('{{time}}'), { params: { time: 2000 } })
    ]),
    trigger('vertical', [
      state('*',
        style(
          { marginTop: '{{y}}%' }
        ),
        {
          params: {
            y: 0
          }
        }
      ),
      transition("*=>*", animate('{{time}}'), { params: { time: 2000 } })
    ]),
    trigger('rotate', [
      state('*',
        style(
          { transform: 'rotate({{angle}}deg)' }
        ),
        {
          params: {
            angle: 0
          }
        }
      ),
      transition("*=>*", animate('{{time}}'), { params: { time: 2000 } })
    ]),
    trigger('shake', [
      transition("*=>*", 
        animate('{{time}}', keyframes([
          style({ background: "rgba(211, 15, 15, 0.5)" }),
          style({ background: "rgba(211, 15, 15, 0)" }),
          style({ background: "rgba(211, 15, 15, 0.5)" }),
          style({ background: "rgba(211, 15, 15, 0)" })
        ])), 
        { params: { time: 2000 } }
      )
    ])
  ]
})
export class SolvePageComponent {

  commands: Block[] = [
    { "type": "simple", "text": "Шаг вперед", color: "rgb(83, 94, 245)", include: [] },
    { "type": "simple", "text": "Поворот налево", color: "rgb(83, 94, 245)", include: [] },
    { "type": "simple", "text": "Поворот направо", color: "rgb(83, 94, 245)", include: [] },
    { "type": "composite", "text": "Повторить", color: "rgb(226, 103, 31)", include: [], numberofRepeates: 2 },
  ]

  program: Block[] = []

  animationTime = '0s'

  constructor(
    private route: ActivatedRoute,
    private httpService: HttpService,
  ) { }

  id = Number(this.route.snapshot.paramMap.get('id'))

  // n = 0; m = 0;  
  // x = 0; y = 0;
  // angle = 0;


  change = 0

  @ViewChildren(CdkDropList)
  private dlq?: QueryList<CdkDropList>;
  public dls: CdkDropList[] = [];

  max = 0; cellSize = 0;
  cells: string[] = Array.from("");
  task: Task = {
    id: 0,
    owner: {
      username: "",
      token: ""
    },
    n: 0,
    m: 0,
    grid: "",
    x: 0,
    y: 0,
    angle: 0
  }
  xy = 0;
  defaultX = 0;defaultY = 0;defaultAngle = 0;


  forOptions = [2, 3, 4, 5, 6, 7, 8]
  shake = false;

  async ngOnInit() {
    this.task = await lastValueFrom(this.httpService.getTaskById(this.id))
    this.max = this.task.n > this.task.m ? this.task.n : this.task.m;
    this.cellSize = 100 / this.max
    this.cells = Array.from(this.task.grid);
    // this.xy = this.task.x + this.task.y
    this.defaultX = this.task.x
    this.defaultY = this.task.y
    this.defaultAngle = this.task.angle

  }

  ngAfterViewChecked() {
    let ldls: CdkDropList[] = [];

    if (this.dlq) {
      this.dlq.forEach((dl) => {
        ldls.push(dl)
      });
    }
    ldls = ldls.reverse()

    if (ldls.length != this.dls.length) {
      asapScheduler.schedule(() => { this.dls = ldls; });
    } else {
      let same = true
      for (let i = 0; i < ldls.length; i++) {
        same = same && ldls[i] === this.dls[i]
      }
      if (!same) {
        asapScheduler.schedule(() => { this.dls = ldls; });
      }
    }
  }

  drop(event: CdkDragDrop<Block[]>) {
    if (event.previousContainer.id == "from") {

      let copy = cloneBlock(event.previousContainer.data[event.previousIndex])
      event.container.data.splice(event.currentIndex, 0, copy)


    } else if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  delete(event: CdkDragDrop<Block[]>) {
    if (event.previousContainer !== event.container) {
      event.previousContainer.data.splice(event.previousIndex, 1)
    }
  }

  async runProgram(commands: Block[]) {
    this.animationTime = '0.3s'
    await this.run(commands)
    await sleep(sleepTime)
    this.animationTime = '0s'
    this.task.x = this.defaultX
    this.task.y = this.defaultY 
    this.task.angle = this.defaultAngle


  }
  async run(commands: Block[]) {
    for (let i = 0; i < commands.length; i++) {
      if (commands[i].type == "simple") {
        if (commands[i].text == "Шаг вперед") {
          if (this.canTakeStep()) {
            this.stepForward()
            await sleep(sleepTime)
          } else {
            this.shake = !this.shake
            break;
          }
        } else if (commands[i].text == "Поворот налево") {
          this.rotateLeft()
          await sleep(sleepTime)
        } else if (commands[i].text == "Поворот направо") {
          this.rotateRight()
          await sleep(sleepTime)
        }
      } else {
        if (commands[i].text == "Повторить") {
          for (let j = 0; j < (commands[i].numberofRepeates || 2); j++) {
            await this.run(commands[i].include)
          }
        }
      }
    }
  }

  rotateRight(): void { this.task.angle += 90 }

  rotateLeft(): void {
    this.task.angle -= 90
  }

  stepForward(): void {
    if (this.task.angle % 360 == 0) {
      this.task.y -= 1
    } else if (this.task.angle % 360 == 90 || this.task.angle % 360 == -270) {
      this.task.x += 1
    } else if (this.task.angle % 360 == 180 || this.task.angle % 360 == -180) {
      this.task.y += 1
    } else {
      this.task.x -= 1
    }
    this.xy = this.task.x + this.task.y
  }

  canTakeStep(): boolean {
    console.log(this.task.angle)
    console.log(this.task.angle % 360)
    if (this.task.angle % 360 == 0) {
      return !(this.task.y - 1 < 0 || this.cells[(this.task.y - 1) * this.task.m + this.task.x] == "0")
    } else if (this.task.angle % 360 == 90 || this.task.angle % 360 == -270) {
      return !(this.task.x + 1 >= this.task.m || this.cells[this.task.y * this.task.m + this.task.x + 1] == "0")
    } else if (this.task.angle % 360 == 180 || this.task.angle % 360 == -180) {
      return !(this.task.y + 1 >= this.task.n || this.cells[(this.task.y + 1) * this.task.m + this.task.x] == "0")
    } else {
      return !(this.task.x - 1 < 0 || this.cells[this.task.y * this.task.m + this.task.x - 1] == "0")
    }
  }

}
