import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service/auth.service';

@Component({
  selector: 'student-navbar-v',
  templateUrl: './student-navbar-v.component.html',
  styleUrls: ['./student-navbar-v.component.css']
})
export class StudentNavbarVComponent {
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
