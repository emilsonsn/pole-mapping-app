import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class City2Service {
  private apiUrl = 'http://api.geonames.org/searchJSON'; 
  private username = 'emilsonsn';

  constructor(private http: HttpClient) {}

  getCities(query: string): Observable<{ city: string, state: string, country: string }[]> {
    return this.http
      .get<any>(`${this.apiUrl}?q=${query}&maxRows=10&featureClass=P&username=${this.username}`)
      .pipe(
        map((res) =>
          res.geonames.map((city: any) => ({
            city: city.name,
            state: city.adminName1, // Nome do estado/província
            country: city.countryName // Nome do país
          }))
        )
      );
  }
}
