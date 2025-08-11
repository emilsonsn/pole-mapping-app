import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingRoutingModule } from './setting-routing.module';
import { SettingComponent } from './setting/setting.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@NgModule({
  declarations: [
    SettingComponent
  ],
  imports: [
    CommonModule,
    SettingRoutingModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatSelectModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ]
})
export class SettingModule { }
