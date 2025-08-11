import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutsModule} from "@shared/layouts/layouts.module";
import {TablesModule} from "@shared/tables/tables.module";
import {PipesModule} from "@shared/pipes/pipes.module";
import {ComponentsModule} from "@shared/components/components.module";
import { DialogsModule } from './dialogs/dialogs.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ComponentsModule,
    LayoutsModule,
    PipesModule,
    TablesModule,
    DialogsModule
  ],
  exports: [
    ComponentsModule,
    LayoutsModule,
    PipesModule,
    TablesModule,
    DialogsModule
  ]
})
export class SharedModule {
}
