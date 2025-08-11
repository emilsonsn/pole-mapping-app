import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MaintenanceService {
  private baseUrl = `${environment.api}/maintenances`;

  constructor(private http: HttpClient) {}

  store(data: FormData): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  all() {
    return this.http.get<any[]>(this.baseUrl);
  }

}
