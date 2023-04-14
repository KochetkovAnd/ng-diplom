import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service/auth.service';

@Component({
  selector: 'admin-navbar-v',
  templateUrl: './admin-navbar-v.component.html',
  styleUrls: ['./admin-navbar-v.component.css']
})
export class AdminNavbarVComponent {
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
