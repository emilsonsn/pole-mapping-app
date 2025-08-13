import { Component, OnInit } from '@angular/core';
import { MaintenanceService } from '@services/maintenance.service';

@Component({
  selector: 'app-maintenance-history',
  templateUrl: './maintenance-history.component.html',
  styleUrls: ['./maintenance-history.component.scss']
})
export class MaintenanceHistoryComponent {
  loading = false;
  filters: any = {};
  searchTerm = '';
  selected: any = null;

  onRowClick(item: any) {
    this.selected = item;
  }

  closeDetails() {
    this.selected = null;
  }
}
