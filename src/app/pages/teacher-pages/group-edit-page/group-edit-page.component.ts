import { animate, state, style, transition, trigger } from '@angular/animations';
import { transferArrayItem } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { connect, lastValueFrom } from 'rxjs';
import { Group } from 'src/app/models/group';
import { Task } from 'src/app/models/task';
import { User } from 'src/app/models/user';
import { HttpService } from 'src/app/services/http-service/http.service';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
@Component({
  selector: 'app-group-edit-page',
  templateUrl: './group-edit-page.component.html',
  styleUrls: ['./group-edit-page.component.css'],
  animations: [
    trigger('add', [
      state('closed',
        style(
          { width: "100%" }
        )
      ),
      state('open',
        style(
          { width: "50%" }
        )
      ),
      transition("*=>*", animate('0.2s'))
    ]),
    trigger('reverse-add', [
      state('closed',
        style(
          {
            width: "0%",
          }
        )
      ),
      state('open',
        style(
          {
            width: "50%",
          }
        )
      ),
      transition("*=>*", animate('0.2s'))
    ]),
  ]
})
export class GroupEditPageComponent {

  constructor(
    private httpService: HttpService,
    private route: ActivatedRoute
  ) { }

  isClosed = true

  id = Number(this.route.snapshot.paramMap.get('id'))
  group: Group | undefined
  students: User[] = []
  tasks: Task[] = []
  unusedTasks: Task[] = []
  text_error = ""

  async ngOnInit() {
    this.group = await lastValueFrom(this.httpService.getGroupById(this.id))
    this.students = await lastValueFrom(this.httpService.getUsersByGroupId(this.id))
    this.tasks = await lastValueFrom(this.httpService.getAllTasks())
    if (this.group != undefined) {
      for (let i = 0; i < this.tasks.length; i++) {
        let contains = false
        for (let j = 0; j < this.group.tasks.length; j++) {
          if (this.tasks[i].id == this.group.tasks[j].id) {
            contains = true
            break
          }        
        }
        if (!contains) {
          this.unusedTasks.push(this.tasks[i])
        }
      }
    }
  }

  transfer(i: number) {
    if (this.group) {
      transferArrayItem(this.unusedTasks, this.group?.tasks, i, this.group?.tasks.length)
    } 
  }

  transferBack(i: number) {
    if (this.group) {
      transferArrayItem(this.group?.tasks, this.unusedTasks, i, this.unusedTasks.length)
    } 
  }

  async onClick() {
    this.isClosed = !this.isClosed
    await sleep(200);
  }

  async save() {
    if (this.group) {
      if (this.group.name.length >= 6 && this.group.name.length <= 15) {
        let response = await lastValueFrom(this.httpService.updateGroup(this.group))
        this.text_error = ""
        if (response.error) {
          this.text_error = "Группа с таким названием уже существует"
        }
      } else {
        this.text_error = "Название группы должно быть от 5 до 16 символов"
      }
    }
  }
}
