import { Component } from '@angular/core';
import {environment} from "@env/environment";

@Component({
  selector: 'app-layout-public-header',
  templateUrl: './layout-public-header.component.html',
  styleUrl: './layout-public-header.component.scss'
})
export class LayoutPublicHeaderComponent {
  title: string = environment.appName;

}
