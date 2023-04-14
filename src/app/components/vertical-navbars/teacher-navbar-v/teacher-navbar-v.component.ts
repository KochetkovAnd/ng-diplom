import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service/auth.service';

@Component({
  selector: 'teacher-navbar-v',
  templateUrl: './teacher-navbar-v.component.html',
  styleUrls: ['./teacher-navbar-v.component.css']
})
export class TeacherNavbarVComponent {

  constructor (
    private authService: AuthService,
    private router: Router
  ) {}

  isOpen = false

  onClick() {
    this.authService.logout()
    this.router.navigate(['/login'])
  }  
}
