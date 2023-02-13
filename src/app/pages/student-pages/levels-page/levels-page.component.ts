import { Component, IterableDiffers } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { Task } from 'src/app/models/task';
import { HttpService } from 'src/app/services/http-service/http.service';


const contains = (arr: Task[], elem: Task) => {

  let res = false
  arr.forEach(item => {
    if (item.id == elem.id) {
      res = true
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
  solveTasks: Task[] = []
  solvedTasks: Task[] = []

  // colorTasks: Task[] = []

  constructor(
    private httpService: HttpService,
    private router: Router
  ) { }

  async ngOnInit() {
    this.tasks = await lastValueFrom(this.httpService.getAvailableTasks())
    this.solveTasks = await lastValueFrom(this.httpService.getSolveTasks())
    this.solvedTasks = await lastValueFrom(this.httpService.getSolvedTasks())

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
  getColor(task: Task) {
    let color = "new"
    if (contains(this.solveTasks, task)) {
      color = "in process"
    } else if (contains(this.solvedTasks, task)) {
      color = "completed"
    }
    return color
  }
}
