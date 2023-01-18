import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DropListGroupComponent } from './drop-list-group/drop-list-group.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    AppComponent,
    DropListGroupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DragDropModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
