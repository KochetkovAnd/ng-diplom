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


  isTeacherDelete = false
  deletedTeacher: User | undefined
  canDeleteTeacher = true
  deletedTeacherI = -1

  isStudentDelete = false
  deletedStudent: User | undefined
  canDeleteStudent = true
  deletedStudentI = -1



  async ngOnInit() {
    this.users = await lastValueFrom(this.httpService.getAllUsers())
    this.users.forEach(user => {
      if (user.role == "STUDENT") {
        this.students.push(user)
      } else if (user.role == "TEACHER") {
        this.teachers.push(user)
      }
    })
  }

  async addUser() {
    if (this.add_user) {
      if (this.user_login.length >= 6 && this.user_login.length <= 15 && this.user_password.length >= 6 && this.user_password.length <= 15) {
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
        this.error_user = "Логин и пароль должны быть от 6 до 15 символов"
      }

    } else {
      this.add_user = true
    }
  }

  async addTeacher() {
    if (this.add_teacher) {
      if (this.teacher_login.length >= 6 && this.teacher_login.length <= 15 && this.teacher_password.length >= 6 && this.teacher_password.length <= 15) {
        let response = await lastValueFrom(this.httpService.register(this.teacher_login, this.teacher_password, "TEACHER"))
        if (response.id) {
          this.teachers.push(response)
          this.error_teacher = ""
          this.teacher_login = ""
          this.teacher_password = ""
          this.add_teacher = false
        } else {
          this.error_teacher = "Пользователь с таким именем уже существует"
        }
      } else {
        this.error_teacher = "Логин и пароль должны быть от 6 до 15 символов"
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

  async deleteStudent(student: User, i: number) {
    this.deletedStudent = student
    this.deletedStudentI = i
    this.canDeleteStudent = await lastValueFrom(this.httpService.canDeleteUserById(student.id))
    this.isStudentDelete = true
  }

  async deleteTeacher(student: User, i: number) {
    this.deletedTeacher = student
    this.deletedTeacherI = i
    this.canDeleteTeacher = await lastValueFrom(this.httpService.canDeleteUserById(student.id))
    this.isTeacherDelete = true
  }

  async sureDeleteStudent() {
    if (this.deletedStudent) {
      let response = await lastValueFrom(this.httpService.sureDeleteUserById(this.deletedStudent.id))
      console.log(response)
      this.students.splice(this.deletedStudentI, 1)
      this.isStudentDelete = false
    }    
  }

  async sureDeleteTeacher() {
    if (this.deletedTeacher) {
      let response = await lastValueFrom(this.httpService.sureDeleteUserById(this.deletedTeacher.id))
      
      this.teachers.splice(this.deletedTeacherI, 1)
      this.isTeacherDelete = false
    }    
  }
}
