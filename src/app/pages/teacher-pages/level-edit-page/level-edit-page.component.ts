import { style } from '@angular/animations';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { Block } from 'src/app/models/block';
import { Task } from 'src/app/models/task';
import { HttpService } from 'src/app/services/http-service/http.service';


const defaultTask: Task = {
  n: 5,
  m: 5,
  grid: "0000000000000000000000000",
  x: 0,
  y: 0,
  angle: 0,
  name: '',
  commands: []
}

const cloneTask = (task:Task) => {
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
  selector: 'app-level-edit-page',
  templateUrl: './level-edit-page.component.html',
  styleUrls: ['./level-edit-page.component.css']
})
export class LevelEditPageComponent {

  constructor(
    private httpService: HttpService,
    private router: Router
  ) 
  {
    let state = this.router.getCurrentNavigation()?.extras.state
    if (state) {      
      this.task = state['task']      
    } else {
      this.task = cloneTask(defaultTask)
    }
  }

  forOptions = [2, 3, 4, 5, 6, 7, 8]
  ifOptions = ["Дорога справа", "Дорога слева", "Дорога сверху", "Дорога снизу"]
  commands: Block[] = []
  task: Task | undefined;
  cells: string[] = [];
  max = 0; cellSize = 0;
  a = 90
  text_error = ""

  items: number[][] = []

  async ngOnInit() {
    if (this.task) {
      this.commands = await lastValueFrom(this.httpService.getAllCommands())
      this.reset()
    }   
  }

  onChange(command: Block,) {
    if (this.task) {
      let pos = this.getPos(command)
      if (pos == -1) {
        this.task.commands.push(command)
      } else {
        this.task.commands.splice(pos, 1)
      }
    }
  }
  getPos(command: Block) {
    if (this.task) {
      for (let i = 0; i < this.task.commands.length; i++) {
        if (this.task.commands[i].id == command.id) {
          return i
        }
      }
    }
    return -1
  }

  NMChange() {
    if (this.task) {
      this.task.grid = "0".repeat((this.task.n * this.task.m))
      this.reset()      
    }
  }

  reset() {
    if (this.task) {
      this.cells = Array.from(this.task.grid);
      this.max = this.task.n > this.task.m ? this.task.n : this.task.m;
      this.cellSize = 100 / this.max
      this.items = []
      for (let i = 0; i < this.task.m * this.task.n ; i++) {
        this.items[i] = []
      }
      this.items[this.task.y * this.task.m + this.task.x] = [1]
    }
  }

  onClickCell(i: number) {
    if (this.task) {
      if (this.cells[i] == "0") {
        this.cells[i] = "1"
      } else if (this.cells[i] == "1") {
        this.cells[i] = "2"
      } else {
        this.cells[i] = "0"
      }
    }
  }

  async save() {
    if (this.task) {
      if (this.task.name.length >= 6 && this.task.name.length <= 25) {
        for (let i = 0; i < this.task.n; i++) {
          for (let j = 0; j < this.task.m; j++) {
            if (this.items[i * this.task.m + j].length > 0) {
              this.task.x = j
              this.task.y = i
            }
          }
        }
        let str = ""
        this.cells.forEach(s => str += s)
        this.task.grid = str
        let response = await lastValueFrom(this.httpService.updateTask(this.task))
        if (response.error) {
          this.text_error = "Задание с таким названием уже существует"
        } else {
          this.task = response
          this.text_error = ""
        }       
        
      } else {
        this.text_error = "Название должно быть от 6 до 25 символов"
      }     
    }
  }

  drop() {
    this.task = cloneTask(defaultTask)
    this.reset()
  }

  transfer(event: CdkDragDrop<number[]>) {
    transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex)
  }

  left() {
    if (this.task) {
      if (this.task.angle == 0) {
        this.task.angle = 270
      } else {
        this.task.angle -= 90
      }
    }
  }

  right() {
    if (this.task) {
      if (this.task.angle == 270) {
        this.task.angle = 0
      } else {
        this.task.angle += 90
      }
    }
  }  
}
