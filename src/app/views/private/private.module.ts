import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivateRoutingModule } from './private-routing.module';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PrivateRoutingModule,
  ]
})
export class PrivateModule { }
