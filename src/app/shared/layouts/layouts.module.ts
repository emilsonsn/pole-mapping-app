import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutPublicComponent } from './layout-public/layout-public.component';
import { LayoutPublicHeaderComponent } from './layout-public/layout-public-header/layout-public-header.component';
import { LayoutPublicFooterComponent } from './layout-public/layout-public-footer/layout-public-footer.component';
import { LayoutPublicSidebarComponent } from './layout-public/layout-public-sidebar/layout-public-sidebar.component';
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {MatDivider} from "@angular/material/divider";
import { LayoutPrivateComponent } from './layout-private/layout-private.component';
import { MatRippleModule } from '@angular/material/core';
import { SidebarPrivateComponent } from './layout-private/sidebar-private/sidebar-private.component';
import { HeaderPrivateComponent } from './layout-private/header-private/header-private.component';
import { FooterPrivateComponent } from './layout-private/footer-private/footer-private.component';



@NgModule({
  declarations: [
    LayoutPublicComponent,
    LayoutPublicHeaderComponent,
    LayoutPublicFooterComponent,
    LayoutPublicSidebarComponent,
    LayoutPrivateComponent,
    SidebarPrivateComponent,
    HeaderPrivateComponent,
    FooterPrivateComponent
  ],
  imports: [
    CommonModule,
    RouterOutlet,
    MatDivider,
    RouterLink,
    MatRippleModule,
    RouterLinkActive
  ]
})
export class LayoutsModule { }
