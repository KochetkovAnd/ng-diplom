import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './guards/admin-guard/admin.guard';
import { StudentGuard } from './guards/student-guard/student.guard';
import { TeacherGuard } from './guards/teacher-guard/teacher.guard';
import { GroupEditPageComponent } from './pages/group-edit-page/group-edit-page.component';
import { GroupPageComponent } from './pages/group-page/group-page.component';
import { LevelEditPageComponent } from './pages/level-edit-page/level-edit-page.component';
import { LevelsPageComponent } from './pages/levels-page/levels-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { SolvePageComponent } from './pages/solve-page/solve-page.component';
import { TasksPageComponent } from './pages/tasks-page/tasks-page.component';
import { UsersPageComponent } from './pages/users-page/users-page.component';

const routes: Routes = [  
  { path: 'login', component: LoginPageComponent },
  { path: 'levels', component: LevelsPageComponent, canActivate: [StudentGuard]},
  { path: 'level/:id', component: SolvePageComponent, canActivate: [StudentGuard]},
  { path: 'groups', component: GroupPageComponent, canActivate: [TeacherGuard]},
  { path: 'group/:id', component: GroupEditPageComponent, canActivate: [TeacherGuard]},
  { path: 'edit-level', component: LevelEditPageComponent, canActivate: [TeacherGuard]},
  { path: 'tasks' , component: TasksPageComponent, canActivate: [TeacherGuard]},
  { path: 'users', component: UsersPageComponent, canActivate: [AdminGuard]},
  { path: '**', redirectTo: '/login', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
