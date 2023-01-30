import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class HttpService {


  baseURL = "http://localhost:4200/api/"

  constructor(
    private http: HttpClient
  ) { }

  login(username: string, password: string) {
    return this.http.post<User>(this.baseURL + "auth/login",
    {
      username,
      password
    }).pipe(catchError((error: any, caught: Observable<any>): Observable<any> => { 
      return of(error);
  }))
  }
}
