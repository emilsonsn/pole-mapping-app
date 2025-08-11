import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-card-benefiting-public',
  templateUrl: './card-benefiting-public.component.html',
  styleUrl: './card-benefiting-public.component.scss'
})
export class CardBenefitingPublicComponent {
  @Input() title!: string;
  @Input() description!: string;
}
