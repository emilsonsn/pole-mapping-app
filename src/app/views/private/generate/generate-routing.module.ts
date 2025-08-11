import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenerateComponent } from './generate/generate.component';
import { GeneratedComponent } from './generated/generated.component';

const routes: Routes = [
  {
    path: '',
    component: GenerateComponent
  },
  {
    path: 'all',
    component: GeneratedComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GenerateRoutingModule { }
