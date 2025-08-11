import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse, ApiResponsePageable, PageControl } from '@models/application';
import { Sale } from '@models/sale';
import { Utils } from '@shared/utils';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private readonly baseUrl = `${environment.api}/sale`;

  constructor(
    private readonly _http: HttpClient
  ) { }

  search(pageControl?: PageControl, filters?: any): Observable<ApiResponsePageable<Sale>> {

    const paginate = Utils.mountPageControl(pageControl);
    const filterParams = Utils.mountPageControl(filters);

    return this._http.get<ApiResponsePageable<Sale>>(`${this.baseUrl}/search?${paginate}${filterParams}`);
  }

  getById(id: string): Observable<any> {
    return this._http.get(`${this.baseUrl}/${id}`);
  }

  verifyPayment(id: string): Observable<any> {
    return this._http.get(`${this.baseUrl}/verify-payment/${id}`);
  }
  
  create(sale: Sale): Observable<ApiResponse<Sale>> {
    return this._http.post<ApiResponse<Sale>>(`${this.baseUrl}/create`, sale);
  }

}
