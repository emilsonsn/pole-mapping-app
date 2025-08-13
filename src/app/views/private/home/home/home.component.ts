import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import dayjs from 'dayjs';
import { DashboardService } from '@services/dashboard.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  loading = false;
  salesToday = 0;
  leadsToday = 0;
  monthlyRevenue = 0;

  filters = {
    date_from: dayjs().format('YYYY-MM-DD'),
    date_to: dayjs().format('YYYY-MM-DD')
  };

  constructor(private readonly routeService: Router, private readonly dashboard: DashboardService) {}

  ngOnInit() {
    this.loadCards();
  }

  loadCards() {
    this.loading = true;
    this.dashboard.cards()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: r => {
          this.leadsToday = r.leadsToday ?? 0;
          this.monthlyRevenue = r.monthlyRevenue ?? 0;
          this.salesToday = r.salesToday ?? 0;
        },
        error: () => {}
      });
  }
}
