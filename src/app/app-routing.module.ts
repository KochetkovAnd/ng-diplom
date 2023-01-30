import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DropListGroupComponent } from './drop-list-group/drop-list-group.component';
import { AuthGuard } from './guards/auth-guard/auth.guard';
import { LoginPageComponent } from './pages/login-page/login-page.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: 'login', component: LoginPageComponent },
  { path: 'switch-later', component: DropListGroupComponent, canActivate: [AuthGuard] }  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
