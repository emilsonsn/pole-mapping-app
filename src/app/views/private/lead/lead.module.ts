import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeadRoutingModule } from './lead-routing.module';
import { LeadComponent } from './lead/lead.component';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [
    LeadComponent
  ],
  imports: [
    CommonModule,
    LeadRoutingModule,
    SharedModule
  ]
})
export class LeadModule { }
