import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { asapScheduler, async, lastValueFrom } from 'rxjs';
import { Block } from 'src/app/models/block';
import { Task } from 'src/app/models/task';
import { HttpService } from 'src/app/services/http-service/http.service';

const sleepTime = 300;
const defaultTask: Task = {
  id: 0,
  owner: {
    id: 0,
    name: "",
    role: ""
  },
  n: 0,
  m: 0,
  grid: "",
  x: 0,
  y: 0,
  angle: 0,
  name: '',
  commands: []
}



const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const cloneBlock = (block: Block) => {
  let clone: Block = {
    id: block.id,
    type: block.type,
    text: block.text,
    color: block.color,
    include: [],
  }
  if (block.numberOfRepeats) {
    clone.numberOfRepeats = block.numberOfRepeats
  }
  return clone
}

const cloneTask = (task: Task) => {
  let clone: Task = {
    id: task.id,
    owner: task.owner,
    n: task.n,
    m: task.m,
    grid: task.grid,
    x: task.x,
    y: task.y,
    angle: task.angle,
    name: task.name,
    commands: task.commands
  }
  return clone
}

const findEndBrace = (line: string, start: number) => {
  let n = 0
  for (let i = start; i < line.length; i++) {
    if (line[i] == "{") {
      n++
    }
    if (line[i] == "}") {
      n--
    }
    if (n == 0) {
      return i
    }
  }
  return -1
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
    ])
  ]
})
export class SolvePageComponent {

  constructor(
    private route: ActivatedRoute,
    private httpService: HttpService,
  ) { }
  // CDK
  @ViewChildren(CdkDropList)
  private dlq?: QueryList<CdkDropList>;
  public dls: CdkDropList[] = [];
  // Routes
  id = Number(this.route.snapshot.paramMap.get('id'))
  // Task 
  task: Task | undefined;
  taskClone: Task | undefined;
  program: Block[] = []
  cells: string[] = [];
  // Variable
  animationTime = '0s'
  max = 0; cellSize = 0;
  forOptions = [2, 3, 4, 5, 6, 7, 8]
  win = false
  isButtonActive = true
  result = false
  resultText = ""



  async ngOnInit() {
    this.task = await lastValueFrom(this.httpService.getTaskById(this.id))
    this.taskClone = cloneTask(this.task)
    this.max = this.task.n > this.task.m ? this.task.n : this.task.m;
    this.cellSize = 100 / this.max
    this.cells = Array.from(this.task.grid);

    let userTask = await lastValueFrom(this.httpService.getUserTaskByUserAndTask(this.task))
    if (!userTask.error) {
      this.parse(userTask.solution, this.program)
    }
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

  getBlockById(id: number) {
    for (let i = 0; i < (this.task || defaultTask).commands.length; i++) {
      if ((this.task || defaultTask).commands[i].id == id) {
        return cloneBlock((this.task || defaultTask).commands[i])
      }
    }
    return undefined
  }

  parse(line: string, items: Block[]) {
    let i = 0
    while (i < line.length) {
      let command = this.getBlockById(parseInt(line[i]))
      if (command) {
        items.push(command)
        if (command.text == "Повторить") {
          command.numberOfRepeats = parseInt(line[i + 1])
          let endBrace = findEndBrace(line, i + 2)
          this.parse(line.slice(i + 3, endBrace), command.include)
          i = endBrace
        }
      }
      i++
    }
  }

  unparse(items: Block[]) {
    let str = ""
    items.forEach(item => {
      str += item.id
      if (item.text == "Повторить") {
        str += item.numberOfRepeats
        str += "{"
        str += this.unparse(item.include)
        str += "}"
      }
    })
    return str
  }

  async clickRun() {
    this.isButtonActive = false
    this.animationTime = '0.3s'
    let error = await this.runProgram(this.program)
    let win = this.checkWin()
    if (win) {
      this.resultText = "Уровень пройден"
      this.win = true
    }
    if (!(win || error)) {
      this.resultText = "Собраны не все ключевые блоки"
    }
    this.result = true
  }

  async save() {
    let solution = this.unparse(this.program)
    if (this.taskClone) {
      await lastValueFrom(this.httpService.updateUserTask({
        task: this.taskClone,
        solved: this.win,
        solution
      }))
    }
  }

  clickOk() {
    this.result = false
    this.animationTime = '0s'
    this.task = cloneTask(this.taskClone || defaultTask)
    this.cells = Array.from(this.task.grid)
    this.isButtonActive = true
  }

  async runProgram(commands: Block[]): Promise<boolean> {

    let i = 0;
    let error = false

    while (i < commands.length && !error) {
      if (commands[i].type == "simple") {
        if (commands[i].text == "Шаг вперед") {
          if (this.canTakeStep()) {
            this.stepForward()
            await sleep(sleepTime)
          } else {
            error = true
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
          for (let j = 0; j < (commands[i].numberOfRepeats || 2); j++) {
            error = await this.runProgram(commands[i].include)
            if (error) { break }
          }
        }
      }
      i++
    }
    return error
  }

  rotateRight(): void { (this.task || defaultTask).angle += 90 }

  rotateLeft(): void {
    (this.task || defaultTask).angle -= 90
  }

  tryRecolor() {
    if (this.cells[(this.task || defaultTask).y * (this.task || defaultTask).m + (this.task || defaultTask).x] == "2") {
      this.cells[(this.task || defaultTask).y * (this.task || defaultTask).m + (this.task || defaultTask).x] = "1"
    }
  }

  checkWin() {
    return !this.cells.includes("2")
  }

  stepForward(): void {
    if ((this.task || defaultTask).angle % 360 == 0) {
      (this.task || defaultTask).y -= 1
    } else if ((this.task || defaultTask).angle % 360 == 90 || (this.task || defaultTask).angle % 360 == -270) {
      (this.task || defaultTask).x += 1
    } else if ((this.task || defaultTask).angle % 360 == 180 || (this.task || defaultTask).angle % 360 == -180) {
      (this.task || defaultTask).y += 1
    } else {
      (this.task || defaultTask).x -= 1
    }
    this.cells[(this.task || defaultTask).y * (this.task || defaultTask).m + (this.task || defaultTask).x] = "1"
  }

  canTakeStep(): boolean {
    if (this.task) {
      if (this.task.angle % 360 == 0) {
        if (this.task.y - 1 < 0) {
          this.resultText = "Ошибка, выход за границы экрана"
        } else {
          if (this.cells[(this.task.y - 1) * this.task.m + this.task.x] == "0") {
            this.resultText = "Ошибка, столкновение со стеной"
          } else {
            return true
          }
        }
      } else if (this.task.angle % 360 == 90 || this.task.angle % 360 == -270) {
        if (this.task.x + 1 >= this.task.m) {
          this.resultText = "Ошибка, выход за границы экрана"
        } else {
          if (this.cells[this.task.y * this.task.m + this.task.x + 1] == "0") {
            this.resultText = "Ошибка, столкновение со стеной"
          } else {
            return true
          }
        }
      } else if (this.task.angle % 360 == 180 || this.task.angle % 360 == -180) {
        if (this.task.y + 1 >= this.task.n) {
          this.resultText = "Ошибка, выход за границы экрана"
        } else {
          if (this.cells[(this.task.y + 1) * this.task.m + this.task.x] == "0") {
            this.resultText = "Ошибка, столкновение со стеной"
          } else {
            return true
          }
        }
      } else {
        if (this.task.x - 1 < 0) {
          this.resultText = "Ошибка, выход за границы экрана"
        } else {
          if (this.cells[this.task.y * this.task.m + this.task.x - 1] == "0") {
            this.resultText = "Ошибка, столкновение со стеной"
          } else {
            return true
          }
        }
      }
    }
    return false
  }


}
