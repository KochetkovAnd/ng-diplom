import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service/auth.service';

@Component({
  selector: 'admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.css']
})
export class AdminNavbarComponent {
  constructor (
    private authService: AuthService,
    private router: Router
  ) {}

  onClick() {
    this.authService.logout()
    this.router.navigate(['/login'])
  }
}
