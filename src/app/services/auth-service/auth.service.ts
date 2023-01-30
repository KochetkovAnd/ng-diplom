import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLogin = false
  tokenAs: string = ""

  constructor() { }

  login(token: string) {
    this.isLogin = true
    this.tokenAs = token
    localStorage.setItem('STATE', 'true')
    localStorage.setItem('TOKEN', this.tokenAs)
  }

  logout() {
    this.isLogin = false
    this.tokenAs = ""
    localStorage.setItem('STATE', 'false');
    localStorage.setItem('TOKEN', "")
  }

  isLoggedIn() {
    const loggedIn = localStorage.getItem('STATE');
    if (loggedIn == 'true')
      this.isLogin = true;
    else
      this.isLogin = false;
    return this.isLogin;
  }

  getToken() {
    let token = localStorage.getItem('TOKEN');
    if (token) {
      this.tokenAs = token
    } else {
      this.tokenAs = ""
    }
    return this.tokenAs;
  }
}
