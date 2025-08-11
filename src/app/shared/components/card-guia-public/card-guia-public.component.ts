import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-card-guia-public',
  templateUrl: './card-guia-public.component.html',
  styleUrl: './card-guia-public.component.scss'
})
export class CardGuiaPublicComponent {
  @Input() icon!: string;
  @Input() title!: string;
  @Input() description!: string;
}
