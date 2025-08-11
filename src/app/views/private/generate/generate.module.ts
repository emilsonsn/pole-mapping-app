import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GenerateRoutingModule } from './generate-routing.module';
import { GenerateComponent } from './generate/generate.component';
import { SharedModule } from '@shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { NgxMaskDirective } from 'ngx-mask';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { GeneratedComponent } from './generated/generated.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';


@NgModule({
  declarations: [
    GenerateComponent,
    GeneratedComponent
  ],
  imports: [
    CommonModule,
    GenerateRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    NgxMaskDirective,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonModule,
    MatAutocompleteModule
  ]
})
export class GenerateModule { }
