import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { User } from 'src/app/models/user';
import { HttpService } from 'src/app/services/http-service/http.service';

@Component({
  selector: 'app-chart-page',
  templateUrl: './chart-page.component.html',
  styleUrls: ['./chart-page.component.css']
})
export class ChartPageComponent {

  constructor(
    private httpService: HttpService,
    private router: Router,
    private route: ActivatedRoute
  )  {  }

  checked: number[] = []
  notChecked: number[] = []
  labels: string[] = []

  users: User[] = []
  max: number = 0

  id = Number(this.route.snapshot.paramMap.get('id'))

  async ngOnInit() {
    this.max = (await lastValueFrom(this.httpService.getGroupById(this.id))).tasks.length
    this.users = await lastValueFrom(this.httpService.getUsersByGroupId(this.id))
    for (let i = 0; i < this.users.length; i++) {
      this.labels.push(this.users[0].name)
      let userTasks = await lastValueFrom(this.httpService.getAllUserTaskByUser(this.users[0]))     
      let c = 0
      let n = 0
      userTasks.forEach(userTask => {
        if (userTask.solution != "") {
          if (userTask.mark != 0) {
            c++
          } else {
            n++
          }
        }        
      })
      this.checked.push(c)
      this.notChecked.push(n)
    }  
  }
}
