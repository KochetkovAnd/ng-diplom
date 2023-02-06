import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentGuard } from './guards/student-guard/student.guard';
import { TeacherGuard } from './guards/teacher-guard/teacher.guard';
import { GroupPageComponent } from './pages/group-page/group-page.component';
import { LevelsPageComponent } from './pages/levels-page/levels-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { SolvePageComponent } from './pages/solve-page/solve-page.component';

const routes: Routes = [  
  { path: 'login', component: LoginPageComponent },
  { path: 'levels', component: LevelsPageComponent, canActivate: [StudentGuard]},
  { path: 'level/:id', component: SolvePageComponent, canActivate: [StudentGuard]},
  { path: 'groups', component: GroupPageComponent, canActivate: [TeacherGuard]},
  { path: '**', redirectTo: '/login', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
