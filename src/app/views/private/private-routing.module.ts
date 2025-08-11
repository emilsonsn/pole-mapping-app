import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LayoutPrivateComponent} from '@shared/layouts/layout-private/layout-private.component';
import { PoleCreateComponent } from './pole-create/pole-create/pole-create.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutPrivateComponent,
    children: [
      {
        path: 'home',
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
      },
      {
        path: 'register',
        loadChildren: () => import('./pole-create/pole-create.module').then(m => m.PoleCreateModule)
      },
      {
        path: 'maintenance',
        loadChildren: () => import('./maintenance/maintenance.module').then(m => m.Maintenance)
      },
      {
        path: 'product',
        loadChildren: () => import('./product/product.module').then(m => m.ProductModule)
      },
      {
        path: 'lead',
        loadChildren: () => import('./lead/lead.module').then(m => m.LeadModule)
      },
      {
        path: 'generate',
        loadChildren: () => import('./generate/generate.module').then(m => m.GenerateModule)
      },
      {
        path: 'setting',
        loadChildren: () => import('./setting/setting.module').then(m => m.SettingModule)
      },
      {
        path: '**',
        redirectTo: 'home',
        canMatch: []
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivateRoutingModule {
}
