import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import dayjs from 'dayjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  public loading: boolean = false;

  public salesToday: number = 10;
  public leadsToday: number = 10;
  public monthlyRevenue: number = 10;

  public filters = {
    date_from: dayjs().format('YYYY-MM-DD'),
    date_to: dayjs().format('YYYY-MM-DD')
  };

  constructor(
    private readonly routeService: Router,
  ){
  }

  ngOnInit(){
    // this.routeService.navigate(['/painel/client']);
  }
}
