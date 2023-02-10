import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { AuthService } from './services/auth-service/auth.service';
import { LevelsPageComponent } from './pages/levels-page/levels-page.component';
import { SolvePageComponent } from './pages/solve-page/solve-page.component';
import { GroupPageComponent } from './pages/group-page/group-page.component';
import { NavbarTeacherComponent } from './components/navbar-teacher/navbar-teacher.component';
import { GroupEditPageComponent } from './pages/group-edit-page/group-edit-page.component';
import { LevelEditPageComponent } from './pages/level-edit-page/level-edit-page.component';
import { TasksPageComponent } from './pages/tasks-page/tasks-page.component';
import { NavbarStudentComponent } from './components/navbar-student/navbar-student.component';
import { UsersPageComponent } from './pages/users-page/users-page.component';
import { AdminNavbarComponent } from './components/admin-navbar/admin-navbar.component';
import { RoleGuard } from './guards/role-guard/role.guard';
import { GroupsAdminPageComponent } from './pages/groups-admin-page/groups-admin-page.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    LevelsPageComponent,
    SolvePageComponent,
    GroupPageComponent,
    NavbarTeacherComponent,
    GroupEditPageComponent,
    LevelEditPageComponent,
    TasksPageComponent,
    NavbarStudentComponent,
    UsersPageComponent,
    AdminNavbarComponent,
    GroupsAdminPageComponent
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    DragDropModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [AuthService, RoleGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
