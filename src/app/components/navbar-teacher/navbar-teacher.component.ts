import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service/auth.service';

@Component({
  selector: 'navbar-teacher',
  templateUrl: './navbar-teacher.component.html',
  styleUrls: ['./navbar-teacher.component.css']
})
export class NavbarTeacherComponent {
  constructor (
    private authService: AuthService,
    private router: Router
  ) {}

  onClick() {
    this.authService.logout()
    this.router.navigate(['/login'])
  }

}
