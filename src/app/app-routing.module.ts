import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DropListGroupComponent } from './drop-list-group/drop-list-group.component';

const routes: Routes = [
    {path: '', component: DropListGroupComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
