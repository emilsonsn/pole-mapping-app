import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { MaintenanceHistoryComponent } from './history/maintenance.history.component';
import { AlbumComponent } from './album/album.component';

const routes: Routes = [
  {
    path: '',
    component: MaintenanceComponent
  },
  {
    path: 'history',
    component: MaintenanceHistoryComponent
  },
  {
    path: 'album',
    component: AlbumComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintenanceRoutingModule { }
