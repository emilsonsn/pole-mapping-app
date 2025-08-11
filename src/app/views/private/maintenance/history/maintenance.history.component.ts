import { Component, OnInit } from '@angular/core';
import { MaintenanceService } from '@services/maintenance.service';

@Component({
  selector: 'app-maintenance-history',
  templateUrl: './maintenance-history.component.html',
  styleUrls: ['./maintenance-history.component.scss']
})
export class MaintenanceHistoryComponent implements OnInit {
  maintenances: any[] = [];
  selected: any = null;
  loading = false;

  constructor(private service: MaintenanceService) {}

  ngOnInit(): void {
    this.fetch();
  }

  fetch() {
    this.loading = true;
    this.service.all().subscribe({
      next: (res) => {
        this.maintenances = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  selectRow(item: any) {
    this.selected = item;
  }

  closeDetails() {
    this.selected = null;
  }
}
