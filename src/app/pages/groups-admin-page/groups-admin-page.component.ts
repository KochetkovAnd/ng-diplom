import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { Group } from 'src/app/models/group';
import { HttpService } from 'src/app/services/http-service/http.service';

@Component({
  selector: 'app-groups-admin-page',
  templateUrl: './groups-admin-page.component.html',
  styleUrls: ['./groups-admin-page.component.css'],
  animations: [
    trigger('add', [
      state('closed', 
        style(
          {
            height: "0px",
            margin: "0px 10px",
          }
        )
      ),
      state('open', 
        style(
          {
            height: "60px",
            margin: "20px 10px 0px 10px",
          }
        )
      ),
      transition("*=>*", animate('0.2s'))      
    ])    
  ]
})
export class GroupsAdminPageComponent {

  constructor(
    private httpService : HttpService,
    private router: Router
  ) { }

  groups: Group[] = []
  isAdd = false
  groupName = ""
  error = ""

  async ngOnInit() {
    this.groups = await lastValueFrom(this.httpService.getAllGroups())
  }


  async add() {
    if (this.isAdd) {
      let response = await lastValueFrom(this.httpService.createGroup(this.groupName))
      if (response.id) {
        this.groups.push(response)
        this.error = ""
        this.groupName = ""
        this.isAdd = false
      } else {
        this.error = response.error.message
      }
    } else {
      this.isAdd = true
    }
  }

  hide() {
    this.error = ""
    this.isAdd = false
  }
}
