import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhoneMaskPipe } from './phone-mask.pipe';
import { ProductTypePipe } from './product-type.pipe';
import { ReportPipe } from './report.pipe';

const pipes = [
  PhoneMaskPipe,
  ProductTypePipe,
  ReportPipe
];

@NgModule({
  declarations: [
    pipes,
    ReportPipe
  ],
  exports: [
    pipes
  ],
  imports: [
    CommonModule
  ]
})
export class PipesModule { }
