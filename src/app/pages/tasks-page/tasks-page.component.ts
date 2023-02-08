import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { Task } from 'src/app/models/task';
import { HttpService } from 'src/app/services/http-service/http.service';

@Component({
  selector: 'app-tasks-page',
  templateUrl: './tasks-page.component.html',
  styleUrls: ['./tasks-page.component.css']
})
export class TasksPageComponent {

  constructor (
    private httpService: HttpService,
    private router: Router
  ) {}


  tasks: Task[] = []
  myTasks: Task[] = []

  async ngOnInit() {
    this.tasks = await lastValueFrom(this.httpService.getAllTasks())
    this.myTasks = await lastValueFrom(this.httpService.getAllTasksByUser())
  }

  isContain(task: Task) {
    for (let i = 0; i < this.myTasks.length; i++) {
      if (this.myTasks[i].id == task.id) {
        return true
      }
    }
    return false
  }

  onClick(task: Task) {
    this.router.navigate(['edit-level'], {state: {task}})
  }
}
