import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LayoutPublicComponent} from "@shared/layouts/layout-public/layout-public.component";

const routes: Routes = [
  {
    path: '',
    component: LayoutPublicComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule {
}
