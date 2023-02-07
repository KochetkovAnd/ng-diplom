import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { RegisterUser } from 'src/app/models/registerUser';
import { Task } from 'src/app/models/task';
import { AuthService } from '../auth-service/auth.service';
import { UserTask } from 'src/app/models/userTask';
import { Group } from 'src/app/models/group';
import { User } from 'src/app/models/user';
import { Block } from 'src/app/models/block';

@Injectable({
  providedIn: 'root'
})
export class HttpService {


  baseURL = "http://localhost:4200/api"

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  login(username: string, password: string) {
    return this.http.post<RegisterUser>(this.baseURL + "/auth/login",
      {
        username,
        password
      }).pipe(catchError((error: any, caught: Observable<any>): Observable<any> => {
        return of(error);
      }))
  }

  getAvailableTasks() {
    return this.http.get<Task[]>(this.baseURL+ "/task/getAvailableTasks", 
    {headers: new HttpHeaders().append('Authorization', this.authService.getToken())}) 
  }

  getSolveTasks() {
    return this.http.get<Task[]>(this.baseURL+ "/task/getSolveTasks", 
    {headers: new HttpHeaders().append('Authorization', this.authService.getToken())}) 
  }

  getSolvedTasks() {
    return this.http.get<Task[]>(this.baseURL+ "/task/getSolvedTasks", 
    {headers: new HttpHeaders().append('Authorization', this.authService.getToken())}) 
  }

  getUserTaskByUserAndTask(task: Task) {
    return this.http.post<UserTask>(this.baseURL + "/userTask/getByUserAndTask", task,
    {headers: new HttpHeaders().append('Authorization', this.authService.getToken())}).
    pipe(catchError((error: any, caught: Observable<any>): Observable<any> => {
      return of(error);
    }))
  }

  getTaskById(id: number) {
    return this.http.get<Task>(this.baseURL + "/task/getById/" + id,
    {headers: new HttpHeaders().append('Authorization', this.authService.getToken())})
  }

  updateUserTask(userTask: UserTask) {
    return this.http.post<UserTask>(this.baseURL + "/userTask/update", userTask,
    {headers: new HttpHeaders().append('Authorization', this.authService.getToken())})
  }

  getGroupsByTeacher() {
    return this.http.get<Group[]>(this.baseURL + "/group/getAllByTeacher",
    {headers: new HttpHeaders().append('Authorization', this.authService.getToken())})
  }

  getGroupById(id: number) {
    return this.http.get<Group>(this.baseURL + "/group/getById/" + id,
    {headers: new HttpHeaders().append('Authorization', this.authService.getToken())})
  }

  getUsersByGroupId(id: number) {
    return this.http.get<User[]>(this.baseURL + "/user/getAllByGroupId/" + id,
    {headers: new HttpHeaders().append('Authorization', this.authService.getToken())})
  }

  getAllTasks() {
    return this.http.get<Task[]>(this.baseURL + "/task",
    {headers: new HttpHeaders().append('Authorization', this.authService.getToken())})
  }

  updateGroup(group: Group) {
    return this.http.post<Group>(this.baseURL + "/group/update", group,
    {headers: new HttpHeaders().append('Authorization', this.authService.getToken())})
  }

  getAllCommands() {
    return this.http.get<Block[]>(this.baseURL + "/command",
    {headers: new HttpHeaders().append('Authorization', this.authService.getToken())})
  }

  updateTask(task: Task) {
    return this.http.post<Task>(this.baseURL + "/task/update", task,
    {headers: new HttpHeaders().append('Authorization', this.authService.getToken())})
  }
  
}
