import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {environment} from "@env/environment";
import { ApiResponse, ApiResponseQuery } from '@models/application';

export interface City {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class CityService {
  private readonly apiUrl = `${environment.api}/client/citys`;

  constructor(private http: HttpClient) {}

  /**
   * Busca cidades com base em um termo de pesquisa.
   * @param term - Termo de pesquisa.
   * @returns Observable contendo uma lista de cidades filtradas.
   */
  searchCities(term: string): Observable<City[]> {
    const params = { search_term: term }; // Substitua 'q' pelo parâmetro adequado, se necessário
    return this.http.get<ApiResponseQuery<City>>(this.apiUrl, { params }).pipe(
      map((cities) => cities.data.filter((city) => city.name.toLowerCase().includes(term.toLowerCase())))
    );
  }

  /**
   * Busca informações de uma cidade específica por ID.
   * @param id - ID da cidade.
   * @returns Observable com os detalhes da cidade.
   */
  getCityById(id: number): Observable<City> {
    return this.http.get<City>(`${this.apiUrl}/${id}`);
  }
}
