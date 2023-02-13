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
            margin: "20px 10px 0px 10px",
          }
        )
      ),
      transition("*=>*", animate('0.2s'))
    ])

  ]
})
export class UsersPageComponent {

  constructor(
    private httpService: HttpService
  ) { }

  users: User[] = []
  teachers: User[] = []
  students: User[] = []

  user_login = ""
  user_password = ""
  teacher_login = ""
  teacher_password = ""

  error_user = ""
  error_teacher = ""

  add_user = false
  add_teacher = false

  delete: boolean[] = []

  async ngOnInit() {
    this.users = await lastValueFrom(this.httpService.getAllUsers())
    this.users.forEach(user => {
      if (user.role == "STUDENT") {
        this.students.push(user)
      } else if (user.role == "TEACHER") {
        this.teachers.push(user)
        this.delete.push(false)
      }
    })
  }

  async addUser() {
    if (this.add_user) {
      if (this.user_login != "" && this.user_password != "") {
        let response = await lastValueFrom(this.httpService.register(this.user_login, this.user_password, "STUDENT"))
        if (response.id) {
          this.students.push(response)
          this.error_user = ""
          this.user_login = ""
          this.user_password = ""
          this.add_user = false
        } else {
          this.error_user = "Пользователь с таким именем уже существует"
        }
      } else {
        this.error_user = "Логин и пароль не могут быть пустыми строками"
      }
      
    } else {
      this.add_user = true
    }
  }

  async addTeacher() {
    if (this.add_teacher) {
      if (this.teacher_login != "" && this.teacher_password != "") {
        let response = await lastValueFrom(this.httpService.register(this.teacher_login, this.teacher_password, "TEACHER"))
        if (response.id) {
          this.teachers.push(response)
          this.delete.push(false)
          this.error_teacher = ""
          this.teacher_login = ""
          this.teacher_password = ""
          this.add_teacher = false
        } else {
          this.error_teacher = "Пользователь с таким именем уже существует"
        }
      } else {
        this.error_teacher = "Логин и пароль не могут быть пустыми строками"
      }
    } else {
      this.add_teacher = true
    }
  }

  hideTeacher() {
    this.error_teacher = ""
    this.add_teacher = false
  }

  hideUser() {
    this.error_user = ""
    this.add_user = false
  }



  async deleteUser(user: User, i: number) {
    if (user.role == "TEACHER") {
      if (!this.delete[i]) {
        let response = await lastValueFrom(this.httpService.deleteUserById(user.id))
        if (response.error) {
          this.delete[i] = true
        } else {
          this.teachers.splice(i,1)
          this.delete.splice(i,1)
        }
      }
    } else {
      await lastValueFrom(this.httpService.deleteStudentById(user.id))      
      this.students.splice(i,1)
    }
    
  }

  async sureDelete(user: User, i: number) {
    let response = await lastValueFrom(this.httpService.sureDeleteTeacherById(user.id))
    this.teachers.splice(i,1)
    this.delete.splice(i,1)
  }

  closeDelete(i: number) {
    this.delete[i] = false
  }

}
