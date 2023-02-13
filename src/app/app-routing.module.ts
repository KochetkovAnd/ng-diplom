import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from './guards/role-guard/role.guard';
import { GroupEditPageComponent } from './pages/teacher-pages/group-edit-page/group-edit-page.component';
import { GroupPageComponent } from './pages/teacher-pages/group-page/group-page.component';
import { GroupsAdminPageComponent } from './pages/admin-pages/groups-admin-page/groups-admin-page.component';
import { LevelEditPageComponent } from './pages/teacher-pages/level-edit-page/level-edit-page.component';
import { LevelsPageComponent } from './pages/student-pages/levels-page/levels-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { SolvePageComponent } from './pages/student-pages/solve-page/solve-page.component';
import { TasksPageComponent } from './pages/teacher-pages/tasks-page/tasks-page.component';
import { UsersPageComponent } from './pages/admin-pages/users-page/users-page.component';

const routes: Routes = [  
  { path: 'login', component: LoginPageComponent },
  { path: 'levels', component: LevelsPageComponent, canActivate: [RoleGuard]},
  { path: 'level/:id', component: SolvePageComponent, canActivate: [RoleGuard]},
  { path: 'groups', component: GroupPageComponent, canActivate: [RoleGuard]},
  { path: 'group/:id', component: GroupEditPageComponent, canActivate: [RoleGuard]},
  { path: 'edit-level', component: LevelEditPageComponent, canActivate: [RoleGuard]},
  { path: 'tasks' , component: TasksPageComponent, canActivate: [RoleGuard]},
  { path: 'users', component: UsersPageComponent, canActivate: [RoleGuard]},
  { path: 'groups-admin', component: GroupsAdminPageComponent, canActivate: [RoleGuard]},
  { path: '**', redirectTo: '/login', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
