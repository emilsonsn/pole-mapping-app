import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class PoleService {
  private baseUrl = environment.api + '/poles';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  getByQrCode(qrcode: string) {
    return this.http.get<any>(`${this.baseUrl}?qrcode=${qrcode}`);
  }

  create(data: any) {
    return this.http.post<any>(this.baseUrl, data);
  }

  getById(id: number) {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  update(id: number, data: any) {
    return this.http.post<any>(`${this.baseUrl}/${id}?_method=PATCH`, data);
  }  
}
