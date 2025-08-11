import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Setting } from '@models/setting';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  private readonly baseUrl = `${environment.api}/setting`;

  constructor(private readonly _http: HttpClient) { }

  // Get a list of funnels steps with optional query parameters
  search(params?: any): Observable<any> {
    return this._http.get(`${this.baseUrl}/`);
  }


  // Update an existing funnel step
  update(settingData: any): Observable<any> {
    return this._http.post(`${this.baseUrl}?_method=patch`, settingData);
  }

}
