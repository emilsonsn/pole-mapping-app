import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse, ApiResponsePageable, PageControl } from '@models/application';
import { Client } from '@models/client';
import { Product } from '@models/product';
import { Utils } from '@shared/utils';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly baseUrl = `${environment.api}/product`;

  constructor(private readonly _http: HttpClient) { }

  search(pageControl?: PageControl, filters?: any): Observable<ApiResponsePageable<Product>> {

    const paginate = Utils.mountPageControl(pageControl);
    const filterParams = Utils.mountPageControl(filters);

    return this._http.get<ApiResponsePageable<Product>>(`${this.baseUrl}/search?${paginate}${filterParams}`);
  }

  show(): Observable<ApiResponsePageable<Product>> {
    return this._http.get<ApiResponsePageable<Product>>(`${this.baseUrl}/show`);
  }

  create(data: Product): Observable<ApiResponse<Product>> {
    return this._http.post<ApiResponse<Product>>(`${this.baseUrl}/create`, data);
  }

  update(id: number , data: Product): Observable<any> {
    return this._http.post<ApiResponse<Product>>(`${this.baseUrl}/${id}?_method=patch`, data);
  }

  delete(id: number): Observable<any> {
    return this._http.delete(`${this.baseUrl}/${id}`);
  }
  
}
