import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {environment} from "@env/environment";
import {ApiResponse} from "@models/application";
import {ZodiacData, ZodiacSignData} from "@models/quiz/zodiac";

@Injectable({
  providedIn: 'root'
})
export class ZodiacService {
  private dataSubject = new BehaviorSubject<ZodiacData>(null);
  public data$: Observable<ZodiacData> = this.dataSubject.asObservable();

  sendData(data: ZodiacData) {
    this.dataSubject.next(data);
  }

  private baseUrl = `${environment.api}/client`;

  constructor(private http: HttpClient) {
  }

  search(params: any): Observable<any> {
    const httpParams = new HttpParams({fromObject: params});
    return this.http.get(`${this.baseUrl}/search`, {params: httpParams});
  }

  getClientZodiacSign(day_birth: string|number, month_birth: string|number): Observable<ApiResponse<ZodiacSignData>> {
    const httpParams = new HttpParams()
      .set('day_birth', day_birth)
      .set('month_birth', month_birth);

    return this.http.get<ApiResponse<ZodiacSignData>>(`${this.baseUrl}/get-client-zodiac-sing`, {params: httpParams});
  }


  update(id: string | number, data: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string | number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
