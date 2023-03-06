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
            height: "100px",
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
    private httpService: HttpService,
    private router: Router
  ) { }

  groups: Group[] = []
  isAdd = false
  groupName = ""
  error = ""


  isDelete = false
  deletedGroup: Group | undefined
  deletedI = -1



  async ngOnInit() {
    this.groups = await lastValueFrom(this.httpService.getAllGroups())
  }


  async add() {
    if (this.isAdd) {
      if (this.groupName != "") {
        let response = await lastValueFrom(this.httpService.createGroup(this.groupName))
        if (response.id) {
          this.groups.push(response)
          this.error = ""
          this.groupName = ""
          this.isAdd = false
        } else {
          this.error = "Группа с таким названием уже существует"
        }
      } else {
        this.error = "Название группы не может быть пустой строкой"
      }

    } else {
      this.isAdd = true
    }
  }

  hide() {
    this.error = ""
    this.isAdd = false
  }



  async deleteGroup(group: Group, i: number) {
    let response = await lastValueFrom(this.httpService.deleteGroupByIdEmpty(group.id))
    if (response) {
      this.groups.splice(i, 1)
    } else {
      this.deletedGroup = group
      this.deletedI = i
      this.isDelete = true
    }
  }

  async sureDeleteGroup() {
    if (this.deletedGroup) {
      let response = await lastValueFrom(this.httpService.sureDeleteGroupById(this.deletedGroup.id))
      this.groups.splice(this.deletedI, 1)
      this.isDelete = false
    }    
  }
}
