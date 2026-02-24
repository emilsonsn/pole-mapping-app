import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PoleCreateComponent } from './pole-create/pole-create.component';
import { PolesComponent } from './poles/poles.component';

const routes: Routes = [
  {
    path: '',
    component: PoleCreateComponent
  },
  {
    path: 'list',
    component: PolesComponent
  }  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PoleCreateRoutingModule { }
