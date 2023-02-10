import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { HttpService } from 'src/app/services/http-service/http.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  username = ""
  password = ""
  error = ""

  constructor(
    private httpService : HttpService,
    private authService : AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      let role = this.authService.getRole()
      console.log(role)
      if (role == "TEACHER") {
        this.router.navigate(['/groups'])
      } else if (role == "STUDENT") {
        this.router.navigate(['/levels'])
      } else if (role == "ADMIN") {
        this.router.navigate(['/users'])
      }
    }
  }


  async login() {
    let response = await lastValueFrom(this.httpService.login(this.username, this.password))
    if (response.token) {
      this.authService.login(response.token, response.role)
      if (response.role == "TEACHER") {
        this.router.navigate(['/groups'])
      } else if (response.role == "STUDENT") {
        this.router.navigate(['/levels'])
      } else if (response.role == "ADMIN") {
        this.router.navigate(['/users'])
      }      
    } else {
      this.error = "wrong login or password"           
    }
  }
}
