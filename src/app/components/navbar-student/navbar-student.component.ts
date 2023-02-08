import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service/auth.service';

@Component({
  selector: 'navbar-student',
  templateUrl: './navbar-student.component.html',
  styleUrls: ['./navbar-student.component.css']
})
export class NavbarStudentComponent {
  constructor (
    private authService: AuthService,
    private router: Router
  ) {}

  onClick() {
    this.authService.logout()
    this.router.navigate(['/login'])
  }
}
