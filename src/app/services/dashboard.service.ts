import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

export interface DashboardCards {
  maintenancesToday: number;
  maintenancesMonth: number;
  polesToday: number;
  polesMonth: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private baseUrl = `${environment.api}/dashboard`;

  constructor(private http: HttpClient) {}

  cards(): Observable<DashboardCards> {
    return this.http.get<DashboardCards>(`${this.baseUrl}/cards`);
  }
}
