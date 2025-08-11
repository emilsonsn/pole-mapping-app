import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { forkJoin } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuxiliaryService {
  constructor(private http: HttpClient) {}

    private readonly baseUrl = `${environment.api}`;

  getAll() {
    return forkJoin({
      types: this.http.get<any[]>(this.baseUrl + '/types'),
      pavings: this.http.get<any[]>(this.baseUrl + '/pavings'),
      positions: this.http.get<any[]>(this.baseUrl + '/positions'),
      networkTypes: this.http.get<any[]>(this.baseUrl + '/network-types'),
      connectionTypes: this.http.get<any[]>(this.baseUrl + '/connection-types'),
      transformers: this.http.get<any[]>(this.baseUrl + '/transformers'),
      accesses: this.http.get<any[]>(this.baseUrl + '/accesses'),
    });
  }
}
