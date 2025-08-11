import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AvatarComponent} from "@shared/components/avatar/avatar/avatar.component";
import {MatIconModule} from "@angular/material/icon";
import {MatBadge} from "@angular/material/badge";


const components = [AvatarComponent]

@NgModule({
    declarations: components,
  imports: [
    CommonModule,
    MatIconModule,
    MatBadge
  ],
    exports: components
})
export class AvatarModule {
}
