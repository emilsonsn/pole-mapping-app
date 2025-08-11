import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogProductComponent } from './dialog-product/dialog-product.component';
import { TextFieldModule, CdkTextareaAutosize } from '@angular/cdk/text-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ComponentsModule } from '@shared/components/components.module';
import { DirectivesModule } from '@shared/directives/directives.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { TablesModule } from '@shared/tables/tables.module';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    DialogProductComponent,
  ],
  imports: [
    CommonModule,
    TablesModule,
    ComponentsModule,
    DirectivesModule,
    PipesModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDividerModule,
    MatRippleModule,
    TextFieldModule,
    CdkTextareaAutosize,
    MatIconModule,
    NgxMaskDirective,
    NgxMaskPipe,
    ToastrModule,
  ],
  providers: [provideNgxMask()]

})
export class DialogsModule { }
