import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { lastValueFrom, map, Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { HttpService } from 'src/app/services/http-service/http.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private httpService: HttpService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.isLoggedIn()) {
      let role = this.authService.getRole()
      let isStudent = role == "STUDENT"
      let isTeacher = role == "TEACHER"
      let isAdmin = role == "ADMIN"
      switch (route.routeConfig?.path) {
        case 'levels':
          if (isStudent) { return true }
          break
        case 'level/:id':
          if (isStudent) { return true }
          break
        case 'groups':
          if (isTeacher) { return true }
          break
        case 'group/:id':
          if (isTeacher) { return true }
          break
        case 'edit-level':
          if (isTeacher) { return true }
          break
        case 'tasks':
          if (isTeacher) { return true }
          break
        case 'users':
          if (isAdmin) { return true }
          break
        case 'groups-admin':
          if (isAdmin) { return true }
          break
        case 'edit-group/:id':
          if (isAdmin) { return true }
          break
        case 'group-stats/:id':
          if (isTeacher) {
            return this.httpService.getGroupsByTeacher().pipe(map(
              res => {
                for (let i = 0; i < res.length; i++) {
                  if (res[i].id == route.params['id']) {
                    return true
                  }
                }
                this.router.navigate(['/groups-admin'])
                return false
              }
            ))
          }         
      }
    }
    this.router.navigate(['/login'])
    return false
  }

}
