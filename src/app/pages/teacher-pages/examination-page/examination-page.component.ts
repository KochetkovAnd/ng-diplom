import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { Block } from 'src/app/models/block';
import { Task } from 'src/app/models/task';
import { UserTask } from 'src/app/models/userTask';
import { HttpService } from 'src/app/services/http-service/http.service';

const sleepTime = 300;
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

@Component({
  selector: 'app-examination-page',
  templateUrl: './examination-page.component.html',
  styleUrls: ['./examination-page.component.css'],
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
export class ExaminationPageComponent {
  constructor(
    private httpService: HttpService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  forOptions = [2, 3, 4, 5, 6, 7, 8]
  markOptions = [1,2,3,4,5,6,7,8,9,10]

  userId = Number(this.route.snapshot.paramMap.get('userId'))
  taskId = Number(this.route.snapshot.paramMap.get('taskId'))

  userTask: UserTask | undefined
  taskClone: Task | undefined
  program: Block[] = []
  cells: string[] = []
  animationTime = '0s'
  max = 0; cellSize = 0

  async ngOnInit() {
    this.userTask = await lastValueFrom(this.httpService.getUserTaskByUserIdAndTaskId(this.userId, this.taskId))
    if (this.userTask) {
      this.taskClone = cloneTask(this.userTask.task)
      this.max = this.userTask.task.n > this.userTask.task.m ? this.userTask.task.n : this.userTask.task.m;
      this.cellSize = 100 / this.max
      this.cells = Array.from(this.userTask.task.grid);
      this.parse(this.userTask.solution, this.program)
    }
  }

  getBlockById(id: number) {
    if (this.userTask) {
      for (let i = 0; i < this.userTask.task.commands.length; i++) {
        if (this.userTask.task.commands[i].id == id) {
          return cloneBlock(this.userTask.task.commands[i])
        }
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

  async clickRun() {
    this.animationTime = '0.3s'
    let error = await this.runProgram(this.program)
    await sleep(sleepTime)
    this.animationTime = '0s'
    if (this.userTask) {
      this.taskClone = cloneTask(this.userTask.task)
      this.cells = Array.from(this.userTask.task.grid)
    }
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

  rotateRight(): void {
    if (this.taskClone) {
      this.taskClone.angle += 90
    }
    
  }

  rotateLeft(): void {
    if (this.taskClone) {
      this.taskClone.angle -= 90
    }
  }

  tryRecolor() {
    if (this.taskClone) {
      if (this.cells[this.taskClone.y * this.taskClone.m + this.taskClone.x] == "2") {
        this.cells[this.taskClone.y * this.taskClone.m + this.taskClone.x] = "1"
      }
    }
    
  }

  checkWin() {
    return !this.cells.includes("2")
  }

  stepForward(): void {
    if (this.taskClone) {
      if (this.taskClone.angle % 360 == 0) {
        this.taskClone.y -= 1
      } else if (this.taskClone.angle % 360 == 90 || this.taskClone.angle % 360 == -270) {
        this.taskClone.x += 1
      } else if (this.taskClone.angle % 360 == 180 || this.taskClone.angle % 360 == -180) {
        this.taskClone.y += 1
      } else {
        this.taskClone.x -= 1
      }
      this.cells[this.taskClone.y * this.taskClone.m + this.taskClone.x] = "1"
    }    
  }

  canTakeStep(): boolean {
    if (this.taskClone) {
      if (this.taskClone.angle % 360 == 0) {
        if (this.taskClone.y - 1 < 0) {
        } else {
          if (this.cells[(this.taskClone.y - 1) * this.taskClone.m + this.taskClone.x] == "0") {           
          } else {
            return true
          }
        }
      } else if (this.taskClone.angle % 360 == 90 || this.taskClone.angle % 360 == -270) {
        if (this.taskClone.x + 1 >= this.taskClone.m) {
        } else {
          if (this.cells[this.taskClone.y * this.taskClone.m + this.taskClone.x + 1] == "0") {
          } else {
            return true
          }
        }
      } else if (this.taskClone.angle % 360 == 180 || this.taskClone.angle % 360 == -180) {
        if (this.taskClone.y + 1 >= this.taskClone.n) {
        } else {
          if (this.cells[(this.taskClone.y + 1) * this.taskClone.m + this.taskClone.x] == "0") {
          } else {
            return true
          }
        }
      } else {
        if (this.taskClone.x - 1 < 0) {
        } else {
          if (this.cells[this.taskClone.y * this.taskClone.m + this.taskClone.x - 1] == "0") {
          } else {
            return true
          }
        }
      }
    }
    return false
  }

  async save() {
    if (this.userTask) {
      await lastValueFrom(this.httpService.updateUserTask(this.userTask))
    }     
  }
}
