import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { lastValueFrom, retryWhen } from 'rxjs';
import { User } from 'src/app/models/user';
import { HttpService } from 'src/app/services/http-service/http.service';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.css'],
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
            margin: "10px",
          }
        )
      ),
      transition("*=>open", animate('0.2s'))      
    ])
    
  ]
})
export class UsersPageComponent {

  constructor(
    private httpService: HttpService
  ) { }

  users: User[] = []
  teachers: string[] = []
  students: string[] = []

  user_login = ""
  user_password = ""
  teacher_login = ""
  teacher_password = ""

  error_user = ""
  error_teacher = ""

  add_user = false
  add_teacher = false

  async ngOnInit() {
    this.users = await lastValueFrom(this.httpService.getAllUsers())
    this.users.forEach(user => {
      if (user.role == "STUDENT") {
        this.students.push(user.name)
      } else if (user.role == "TEACHER") {
        this.teachers.push(user.name)
      }
    })
  }

  async addUser() {
    if (this.add_user) {
      let response = await lastValueFrom(this.httpService.register(this.user_login, this.user_password, "STUDENT"))
      if (response.username) {
        this.students.push(response.username)
        this.error_user = ""
        this.user_login = ""
        this.user_password = ""
        this.add_user = false
      } else {
        this.error_user = response.error.message
      }
    } else {
      this.add_user = true
    }
  }

  async addTeacher() {
    if (this.add_teacher) {
      let response = await lastValueFrom(this.httpService.register(this.teacher_login, this.teacher_password, "TEACHER"))
      if (response.username) {
        this.teachers.push(response.username)
        this.error_teacher = ""
        this.teacher_login = ""
        this.teacher_password = ""
        this.add_teacher = false
      } else {
        this.error_teacher = response.error.message
      }
    } else {
      this.add_teacher = true
    }
  }
}
