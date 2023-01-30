import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DropListGroupComponent } from './drop-list-group/drop-list-group.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { AuthService } from './services/auth-service/auth.service';
import { AuthGuard } from './guards/auth-guard/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    DropListGroupComponent,
    LoginPageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    DragDropModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [AuthService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
