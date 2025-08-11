import {Component} from '@angular/core';
import {environment} from "@env/environment";

@Component({
  selector: 'app-layout-public-footer',
  templateUrl: './layout-public-footer.component.html',
  styleUrl: './layout-public-footer.component.scss'
})
export class LayoutPublicFooterComponent {
  protected version: string = environment.version
}
