import { HttpClient, HttpParams } from '@angular/common/http';
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

 list(params?: {
    search?: string;
    page?: number;
    take?: number;
    order_field?: string;
    order?: 'ASC' | 'DESC';
    start?: string;
    end?: string;
  }): Observable<any> {
    let httpParams = new HttpParams();
    Object.entries(params || {}).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') httpParams = httpParams.set(k, String(v));
    });
    return this.http.get<any>(`${this.baseUrl}/list`, { params: httpParams });
  }
  
}
