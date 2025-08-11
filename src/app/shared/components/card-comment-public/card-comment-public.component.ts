import {Component, Input} from '@angular/core';
import dayjs from "dayjs";

@Component({
  selector: 'app-card-comment-public',
  templateUrl: './card-comment-public.component.html',
  styleUrl: './card-comment-public.component.scss'
})
export class CardCommentPublicComponent {

  @Input() username!: string;
  @Input() date!: Date;
  @Input() comment!: string;
  @Input() rating!: number;

  public getDate(date: Date): string {
    if (date) {
      return dayjs(date.toString()).format('YYYY-MM-DD');
    }
    return '';
  }
}
