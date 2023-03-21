import { Component, IterableDiffers } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { Task } from 'src/app/models/task';
import { UserTask } from 'src/app/models/userTask';
import { HttpService } from 'src/app/services/http-service/http.service';

interface TaskStatus {
  task: Task,
  color: string,
  status: string,
  mark: string 
}

const contains = (arr: UserTask[], elem: Task) => {
  let res = false
  arr.forEach(item => {
    if (item.task.id == elem.id) {
      res = true
    }
  })
  return res
}

function getStatus(arr: UserTask[], elem: Task): TaskStatus {

  let res: TaskStatus = {
    task: elem,
    color: "#FF8F00",
    status: "Новый",
    mark: "-"
  }
  arr.forEach(item => {
    if (item.task.id == elem.id) {
      if (item.solution != "") {
        if (item.mark) {
          res.color = "#009122"
          res.status = "Проверено"
          res.mark = item.mark.toString()
        } else {
          res.color = "#00FF3D"
          res.status = "На проверке"
        }
      } else {
        res.color = "#F2EA00"
        res.status = "В процессе"
      }
    }
  })
  return res
}





@Component({
  selector: 'app-levels-page',
  templateUrl: './levels-page.component.html',
  styleUrls: ['./levels-page.component.css']
})
export class LevelsPageComponent {

  tasks: Task[] = []
  userTasks: UserTask[] = []
  cards: TaskStatus[] = []

  constructor(
    private httpService: HttpService,
    private router: Router
  ) { }

  async ngOnInit() {
    this.tasks = await lastValueFrom(this.httpService.getAvailableTasks())
    this.userTasks = await lastValueFrom(this.httpService.getAllUserTaskByUserToken())
    this.tasks.forEach(task => {
      this.cards.push(getStatus(this.userTasks, task))
    })

    
    
    

    // tasks.forEach(task => {
    //   let color = "white"
    //   if (contains(solveTasks, task)) {
    //     color = "grey"
    //   } else if (contains(solvedTasks, task)) {
    //     color = "green"
    //   }
    //   this.colorTasks.push({color, task})
    // }) 


  }
  // getColor(task: Task) {
  //   let color = "new"
  //   if (contains(this.solveTasks, task)) {
  //     color = "in process"
  //   } else if (contains(this.solvedTasks, task)) {
  //     color = "completed"
  //   }
  //   return color
  // }
}
