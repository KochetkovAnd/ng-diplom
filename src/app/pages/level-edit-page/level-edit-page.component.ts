import { Component } from '@angular/core';
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


@Component({
  selector: 'app-level-edit-page',
  templateUrl: './level-edit-page.component.html',
  styleUrls: ['./level-edit-page.component.css']
})
export class LevelEditPageComponent {

  constructor (
    private httpService: HttpService,
  ) {}

  forOptions = [2, 3, 4, 5, 6, 7, 8]
  commands: Block[] = []
  task: Task | undefined;
  cells: string[] = [];
  max = 0; cellSize = 0;

  async ngOnInit() {
    this.commands = await lastValueFrom(this.httpService.getAllCommands())
    this.task = defaultTask
    this.max = this.task.n > this.task.m ? this.task.n : this.task.m;
    this.cellSize = 100 / this.max
    this.cells = Array.from(this.task.grid);
  }

  onChange(command: Block, ) {
    if (this.task) {
      let pos = this.getPos(command)
      if (pos == -1) {
        this.task.commands.push(command)
      } else {
        this.task.commands.splice(pos,1)
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
    if(this.task) {
      this.task.grid = "0".repeat((this.task.n * this.task.m))
      this.cells = Array.from(this.task.grid);
      this.max = this.task.n > this.task.m ? this.task.n : this.task.m;
      this.cellSize = 100 / this.max
    }
  }

  onClickCell(i: number) {
    if(this.task) {
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
    let str = ""
    this.cells.forEach(s => str += s)
    if (this.task) {
      this.task.grid = str
      this.task = await lastValueFrom(this.httpService.updateTask(this.task))
    }
  }
}
