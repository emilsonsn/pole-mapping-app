import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { TicketCreateComponent } from './home/ticket-create.component';

const routes: Routes = [
  {
    path: '',
    component: TicketCreateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {
}
