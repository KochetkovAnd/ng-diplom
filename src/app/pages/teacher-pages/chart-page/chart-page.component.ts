import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
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

  id = Number(this.route.snapshot.paramMap.get('id'))

  async ngOnInit() {
    let users = await lastValueFrom(this.httpService.getUsersByGroupId(this.id))
    for (let i = 0; i < users.length; i++) {
      this.labels.push(users[0].name)
      let userTasks = await lastValueFrom(this.httpService.getAllUserTaskByUser(users[0]))     
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
