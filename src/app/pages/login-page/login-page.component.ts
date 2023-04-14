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
      this.error = "неправильный логин или пароль"           
    }
  }

  onMouseMove(event: MouseEvent) {
    const image = document.querySelector('img');
    const imageblock = document.querySelector('.image-block') as HTMLImageElement;
    const imageside = document.querySelector('.image-side') as HTMLImageElement;
    const loginform = document.querySelector('.login-form') as HTMLImageElement;
    if (image) {
      if (imageblock) {

        const imageblockX = imageblock.offsetLeft
        const imageblockY = imageblock.offsetTop

        const imagesideX = imageside.offsetLeft
        const imagesideY = imageside.offsetTop

        const loginformX = loginform.offsetLeft
        const loginformY = loginform.offsetTop

        const mouseX = event.pageX - (imageblockX + imagesideX + loginformX + 150);
        const mouseY = event.pageY - (imageblockY + imagesideY + loginformY + 110);
        
        const x = (mouseX / 320) * 100;
        const y = (mouseY / 240) * 100;
        image.style.transform = `rotateX(${-y}deg) rotateY(${x}deg)`;
        
      }      
    }
    
  }

  onMouseOver() {
    const image = document.querySelector('img');
    if (image) {
      image.style.transform = `rotateX(0deg) rotateY(0deg)`;
    }
  }

  

  
}
