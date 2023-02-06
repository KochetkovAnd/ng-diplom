import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLogin = false
  tokenAs: string = ""
  roleAs: string = ""

  constructor() { }

  login(token: string, role: string) {
    this.isLogin = true
    this.tokenAs = token
    this.roleAs = role
    localStorage.setItem('STATE', 'true')
    localStorage.setItem('TOKEN', this.tokenAs)
    localStorage.setItem('ROLE', this.roleAs)
  }

  logout() {
    this.isLogin = false
    this.tokenAs = ""
    this.roleAs = ""
    localStorage.setItem('STATE', 'false');
    localStorage.setItem('TOKEN', "")
    localStorage.setItem('ROLE', "")
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

  getRole() {
    let role = localStorage.getItem('ROLE');
    if (role) {
      this.roleAs = role
    } else {
      this.roleAs = ""
    }
    return this.roleAs;
  }
}
