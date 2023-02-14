import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http-service/http.service';

@Component({
  selector: 'app-group-stats-page',
  templateUrl: './group-stats-page.component.html',
  styleUrls: ['./group-stats-page.component.css']
})
export class GroupStatsPageComponent {

  id: number = 1
  constructor(
    private httpService: HttpService,
    private router: Router
  ) 
  {
    let state = this.router.getCurrentNavigation()?.extras.state
    if (state) {      
      this.id = state['id']      
    }
  }
}
