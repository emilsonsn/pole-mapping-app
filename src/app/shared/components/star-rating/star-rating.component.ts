import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrl: './star-rating.component.scss'
})
export class StarRatingComponent implements OnInit {

  @Input() rating: number = 0;


  selectedRating = 0;
  stars = [
    {
      id: 1,
      icon: 'star',
      class: 'star-gray star-hover star'
    },
    {
      id: 2,
      icon: 'star',
      class: 'star-gray star-hover star'
    },
    {
      id: 3,
      icon: 'star',
      class: 'star-gray star-hover star'
    },
    {
      id: 4,
      icon: 'star',
      class: 'star-gray star-hover star'
    },
    {
      id: 5,
      icon: 'star',
      class: 'star-gray star-hover star'
    }

  ];


  ngOnInit(): void {
    this.selectStar(this.rating);
  }

  selectStar(value: number): void {

    // prevent multiple selection
    if (this.selectedRating === 0) {

      this.stars.filter((star) => {

        if (star.id <= value) {

          star.class = 'star-gold star';

        } else {

          star.class = 'star-gray star';

        }

        return star;
      });

    }

    this.selectedRating = value;


  }

}
