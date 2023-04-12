import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { asapScheduler, async, lastValueFrom } from 'rxjs';
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
    secondInclude: [],
  }
  if (block.numberOfRepeats) {
    clone.numberOfRepeats = block.numberOfRepeats
  }
  if (block.condition) {
    clone.condition = block.condition
  }
  if (block.secondText) {
    clone.secondText = block.secondText
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
  task_id = Number(this.route.snapshot.paramMap.get('id'))

  // Task 
  userTask: UserTask | undefined
  taskClone: Task | undefined;
  program: Block[] = []
  cells: string[] = [];

  // Variable
  animationTime = '0s'
  max = 0; cellSize = 0;
  forOptions = [2, 3, 4, 5, 6, 7, 8]
  ifOptions = ["Дорога справа", "Дорога слева", "Дорога сверху", "Дорога снизу"]
  isButtonActive = true
  isInfoActive = true
  result = false
  resultText = ""



  async ngOnInit() {
    this.userTask = await lastValueFrom(this.httpService.getUserTaskOrCreateByUserAndTaskId(this.task_id))
    this.taskClone = cloneTask(this.userTask.task)
    this.max = this.userTask.task.n > this.userTask.task.m ? this.userTask.task.n : this.userTask.task.m
    this.cellSize = 100 / this.max
    this.cells = Array.from(this.userTask.task.grid)
    this.parse(this.userTask.solution, this.program)
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
    if (this.userTask?.task) {
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
        if (command.type == "composite") {
          if (command.text == "Повторить") {
            command.numberOfRepeats = parseInt(line[i + 1])
            let endBrace = findEndBrace(line, i + 2)
            this.parse(line.slice(i + 3, endBrace), command.include)
            i = endBrace
          } else if (command.text == "Если") {
            command.condition = this.getIfOptionByNumber(parseInt(line[i + 1]))
            let endBrace = findEndBrace(line, i + 2)
            this.parse(line.slice(i + 3, endBrace), command.include)
            i = endBrace
          }
        } else if (command.type == "double") {
          if (command.text == "Если") {
            command.condition = this.getIfOptionByNumber(parseInt(line[i + 1]))
            let endBrace = findEndBrace(line, i + 2)
            this.parse(line.slice(i + 3, endBrace), command.include)
            i = endBrace
            endBrace = findEndBrace(line, i + 1)
            this.parse(line.slice(i + 2, endBrace), command.secondInclude)
            i = endBrace
          }
        }       
      }
      i++
    }
  }

  unparse(items: Block[]) {
    let str = ""
    items.forEach(item => {
      str += item.id

      if (item.type == "composite") {
        if (item.text == "Повторить") {
          str += item.numberOfRepeats
          str += "{"
          str += this.unparse(item.include)
          str += "}"
        } else if (item.text == "Если") {
          str += this.getIfOptionNumber(item)
          str += "{"
          str += this.unparse(item.include)
          str += "}"
        }
      } else if (item.type == "double") {
        if (item.text == "Если") {
          str += this.getIfOptionNumber(item)
          str += "{"
          str += this.unparse(item.include)
          str += "}"
          str += "{"
          str += this.unparse(item.secondInclude || [])
          str += "}"
        }
      }
    })
    return str
  }


  getIfOptionNumber(item: Block) {
    if (item.condition) {
      if (item.condition == "Дорога справа") { return 1 }
      else if (item.condition == "Дорога слева") { return 2 }
      else if (item.condition == "Дорога сверху") { return 3 }
      else if (item.condition == "Дорога снизу") { return 4 }
    }
    return 1
  }

  getIfOptionByNumber(i: number) {
    if (i == 1) {return "Дорога справа"}
    else if (i == 2) {return "Дорога слева"}
    else if (i == 3) {return "Дорога сверху"}
    else {return "Дорога снизу"}    
  }



  async clickRun() {
    this.isButtonActive = false
    this.animationTime = '0.3s'
    let error = await this.runProgram(this.program)
    let win = this.checkWin()
    if (win) {
      this.resultText = "Уровень пройден"
    }
    if (!(win || error)) {
      this.resultText = "Собраны не все ключевые блоки"
    }
    this.result = true
  }

  async save() {
    if (this.userTask && this.taskClone) {
      this.userTask.solution = this.unparse(this.program)
      this.userTask.task = this.taskClone
      await lastValueFrom(this.httpService.updateUserTask(this.userTask))
    }
  }

  clickOk() {
    if (this.userTask?.task && this.taskClone) {
      this.result = false
      this.animationTime = '0s'
      this.userTask.task = cloneTask(this.taskClone)
      this.cells = Array.from(this.userTask.task.grid)
      this.isButtonActive = true
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
      } else if (commands[i].type == "composite") {
        if (commands[i].text == "Повторить") {
          for (let j = 0; j < (commands[i].numberOfRepeats || 2); j++) {
            error = await this.runProgram(commands[i].include)
            if (error) { break }
          }
        } else if (commands[i].text == "Если") {          
          if (commands[i].condition == "Дорога справа") {
            if (this.isRoad(1, 0)) { error = await this.runProgram(commands[i].include) }
          } else if (commands[i].condition == "Дорога слева") {
            if (this.isRoad(-1, 0)) { error = await this.runProgram(commands[i].include) }
          } else if (commands[i].condition == "Дорога сверху") {
            if (this.isRoad(0, -1)) { error = await this.runProgram(commands[i].include) }
          } else if (commands[i].condition == "Дорога снизу") {
            if (this.isRoad(0, 1)) { error = await this.runProgram(commands[i].include) }
          }
        }
      } else if (commands[i].type == "double") {
        if (commands[i].text == "Если") {          
          if (commands[i].condition == "Дорога справа") {
            if (this.isRoad(1, 0)) { error = await this.runProgram(commands[i].include) }
            else { error = await this.runProgram(commands[i].secondInclude || []) }
          } else if (commands[i].condition == "Дорога слева") {
            if (this.isRoad(-1, 0)) { error = await this.runProgram(commands[i].include) }
            else { error = await this.runProgram(commands[i].secondInclude || []) }
          } else if (commands[i].condition == "Дорога сверху") {
            if (this.isRoad(0, -1)) { error = await this.runProgram(commands[i].include) }
            else { error = await this.runProgram(commands[i].secondInclude || []) }
          } else if (commands[i].condition == "Дорога снизу") {
            if (this.isRoad(0, 1)) { error = await this.runProgram(commands[i].include) }
            else { error = await this.runProgram(commands[i].secondInclude || []) }
          }
        }
      }
      i++
    }
    return error
  }

  rotateRight(): void {
    if (this.userTask?.task) {
      this.userTask.task.angle += 90
    }
  }

  rotateLeft(): void {
    if (this.userTask?.task) {
      this.userTask.task.angle -= 90
    }
  }

  tryRecolor() {
    if (this.userTask?.task) {
      if (this.cells[this.userTask.task.y * this.userTask.task.m + this.userTask.task.x] == "2") {
        this.cells[this.userTask.task.y * this.userTask.task.m + this.userTask.task.x] = "1"
      }
    }
  }

  checkWin() {
    return !this.cells.includes("2")
  }

  stepForward(): void {
    if (this.userTask?.task) {
      if (this.userTask.task.angle % 360 == 0) {
        this.userTask.task.y -= 1
      } else if (this.userTask.task.angle % 360 == 90 || this.userTask.task.angle % 360 == -270) {
        this.userTask.task.x += 1
      } else if (this.userTask.task.angle % 360 == 180 || this.userTask.task.angle % 360 == -180) {
        this.userTask.task.y += 1
      } else {
        this.userTask.task.x -= 1
      }
      this.cells[this.userTask.task.y * this.userTask.task.m + this.userTask.task.x] = "1"
    }
  }

  isRoad(shift_x: number, shift_y: number): boolean {
    if (this.userTask?.task) {
      let b1 = this.userTask.task.x + shift_x >= 0 && this.userTask.task.x + shift_x < this.userTask.task.m && this.userTask.task.y + shift_y >= 0 && this.userTask.task.y + shift_y < this.userTask.task.n
      let b2 = this.cells[(this.userTask.task.y + shift_y) * this.userTask.task.m + (this.userTask.task.x + shift_x)] != "0"
      return b1 && b2
    }
    return false
  }

  canTakeStep(): boolean {
    if (this.userTask?.task) {
      if (this.userTask.task.angle % 360 == 0) {
        if (this.userTask.task.y - 1 < 0) {
          this.resultText = "Ошибка, выход за границы экрана"
        } else {
          if (this.cells[(this.userTask.task.y - 1) * this.userTask.task.m + this.userTask.task.x] == "0") {
            this.resultText = "Ошибка, столкновение со стеной"
          } else {
            return true
          }
        }
      } else if (this.userTask.task.angle % 360 == 90 || this.userTask.task.angle % 360 == -270) {
        if (this.userTask.task.x + 1 >= this.userTask.task.m) {
          this.resultText = "Ошибка, выход за границы экрана"
        } else {
          if (this.cells[this.userTask.task.y * this.userTask.task.m + this.userTask.task.x + 1] == "0") {
            this.resultText = "Ошибка, столкновение со стеной"
          } else {
            return true
          }
        }
      } else if (this.userTask.task.angle % 360 == 180 || this.userTask.task.angle % 360 == -180) {
        if (this.userTask.task.y + 1 >= this.userTask.task.n) {
          this.resultText = "Ошибка, выход за границы экрана"
        } else {
          if (this.cells[(this.userTask.task.y + 1) * this.userTask.task.m + this.userTask.task.x] == "0") {
            this.resultText = "Ошибка, столкновение со стеной"
          } else {
            return true
          }
        }
      } else {
        if (this.userTask.task.x - 1 < 0) {
          this.resultText = "Ошибка, выход за границы экрана"
        } else {
          if (this.cells[this.userTask.task.y * this.userTask.task.m + this.userTask.task.x - 1] == "0") {
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
