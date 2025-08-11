import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {hasSessionGuard} from "@app/guards/has-session.guard";

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./views/session/session.module').then(m => m.SessionModule)
  },
  {
    path: 'painel',
    loadChildren: () => import('./views/private/private.module').then(m => m.PrivateModule),
    canActivate: [hasSessionGuard]
  },
  {
    path: 'session',
    loadChildren: () => import('./views/session/session.module').then(m => m.SessionModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
