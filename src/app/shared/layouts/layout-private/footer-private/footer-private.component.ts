import { Component } from '@angular/core';
import {environment} from "@env/environment";

@Component({
  selector: 'app-footer-private',
  templateUrl: './footer-private.component.html',
  styleUrl: './footer-private.component.scss'
})
export class FooterPrivateComponent {
  protected version: string = environment.version
}
