import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PoleCreateComponent } from './pole-create/pole-create.component';

const routes: Routes = [
  {
    path: '',
    component: PoleCreateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PoleCreateRoutingModule { }
