import { transferArrayItem } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { Group } from 'src/app/models/group';
import { Task } from 'src/app/models/task';
import { User } from 'src/app/models/user';
import { HttpService } from 'src/app/services/http-service/http.service';

@Component({
  selector: 'app-group-edit-admin-page',
  templateUrl: './group-edit-admin-page.component.html',
  styleUrls: ['./group-edit-admin-page.component.css']
})
export class GroupEditAdminPageComponent {

  constructor(
    private httpService: HttpService,
    private route: ActivatedRoute
  ) { }

  id = Number(this.route.snapshot.paramMap.get('id'))
  group: Group | undefined
  studentsInGroup: User[] = []
  studentsWithoutGroup: User[] = []
  tasks: Task[] = []
  unusedTasks: Task[] = []
  teachers: User[] = []
  text_error = ""
  addStudents = false
  addTasks = false

  async ngOnInit() {
    this.group = await lastValueFrom(this.httpService.getGroupById(this.id))
    this.studentsInGroup = await lastValueFrom(this.httpService.getUsersByGroupId(this.id))
    this.studentsWithoutGroup = await lastValueFrom(this.httpService.getAllStudentsWithoutGroup())
    this.tasks = await lastValueFrom(this.httpService.getAllTasks())
    this.teachers = await lastValueFrom(this.httpService.getAllTeachers())
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

  onTransferUser(i: number) {
    transferArrayItem(this.studentsWithoutGroup, this.studentsInGroup, i, this.studentsInGroup.length)
  }

  onTransferUserBack(i: number) {
    transferArrayItem(this.studentsInGroup, this.studentsWithoutGroup, i, this.studentsWithoutGroup.length)
  }

  onTransferTask(i: number) {
    if (this.group) {
      transferArrayItem(this.unusedTasks, this.group.tasks, i, this.unusedTasks.length)
    }
  }

  onTransferTaskBack(i: number) {
    if (this.group) {
      transferArrayItem(this.group.tasks, this.unusedTasks, i, this.unusedTasks.length)
    }
  }

  async save() {
    if (this.group) {
      if (this.group.name != "") {
        this.group.students = this.studentsInGroup
        await lastValueFrom(this.httpService.updateGroup(this.group))
      } else {
        this.text_error = "Название не может быть пустым"
      }
    }
  }
}
