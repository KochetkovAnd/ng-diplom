import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { User } from 'src/app/models/user';
import { Task } from 'src/app/models/task';
import { AuthService } from '../auth-service/auth.service';
import { UserTask } from 'src/app/models/userTask';

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
    return this.http.post<User>(this.baseURL + "/auth/login",
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
  
}
