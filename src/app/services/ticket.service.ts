import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class TicketService {
  private baseUrl = environment.api + '/tickets';

  constructor(private http: HttpClient) {}

  getByQrCode(qrcode: string) {
    const params = new HttpParams().set('qrcode', qrcode);
    return this.http.get<any>(this.baseUrl, { params });
  }

  create(formData: FormData) {
    return this.http.post<any>(this.baseUrl, formData);
  }
}
