import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse, ApiResponsePageable, PageControl } from '@models/application';
import { Client } from '@models/client';
import { ZodiacData } from '@models/quiz/zodiac';
import { Utils } from '@shared/utils';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeneratedService {
  private readonly baseUrl = `${environment.api}/generated`;

  constructor(private readonly _http: HttpClient) { }

  search(pageControl?: PageControl, filters?: any): Observable<ApiResponsePageable<any>> {

    const paginate = Utils.mountPageControl(pageControl);
    const filterParams = Utils.mountPageControl(filters);

    return this._http.get<ApiResponsePageable<any>>(`${this.baseUrl}/search?${paginate}${filterParams}`);
  }

}
