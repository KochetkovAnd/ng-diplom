import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { Group } from 'src/app/models/group';
import { Task } from 'src/app/models/task';
import { User } from 'src/app/models/user';
import { UserTask } from 'src/app/models/userTask';
import { HttpService } from 'src/app/services/http-service/http.service';

@Component({
  selector: 'app-group-stats-page',
  templateUrl: './group-stats-page.component.html',
  styleUrls: ['./group-stats-page.component.css']
})
export class GroupStatsPageComponent {

  
  
  constructor(
    private httpService: HttpService,
    private router: Router,
    private route: ActivatedRoute
  )  {  }
  
  id = Number(this.route.snapshot.paramMap.get('id'))
  group: Group | undefined
  students: User[] = []
  solutions: UserTask[] = []
  groupSolutions: UserTask[][] = []


  async ngOnInit() {
    this.group = await lastValueFrom(this.httpService.getGroupById(this.id))
    let tasks: Task[] = this.group.tasks
    this.students = await lastValueFrom(this.httpService.getUsersByGroupId(this.id))
    this.solutions = await lastValueFrom(this.httpService.getAllUserTaskByGroupId(this.id))

    for (let i = 0; i < tasks.length; i++) {
      let task: UserTask[] = []
      for (let j = 0; j < this.students.length; j++) {
        let res = this.getSolution(this.solutions, tasks[i].id || 1, this.students[j].id)        
        if (res) {
          task.push(res)
        } else {
          task.push({
            user: this.students[j],
            task: tasks[i],
            solved: false,
            solution: ""
          })
        }
      }
      this.groupSolutions.push(task)
    }
    
  }

  getSolution(userTasks: UserTask[], taskId: number, userId: number) {
    return userTasks.find( userTask =>  userTask.task.id == taskId  && userTask.user?.id == userId )
  }

  isSolved(line: string) {
    if (line == "") {
      return "нет"
    } else {
      return "да"
    }
  }

  isGetMark(n: number) {
    if (n == 0) {
      return "-"
    } else {
      return n
    }
  }
}
