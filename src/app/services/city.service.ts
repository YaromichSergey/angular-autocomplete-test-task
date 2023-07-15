import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { City } from '../models/city';
import { Country } from '../models/country';

const MOCK_COUNTRIES: Country[] = [
  {id: 1, name: "Afghanistan", code: "AF"},
  {id: 2, name: "land Islands", code: "AX"},
  {id: 3, name: "Albania", code: "AL"},
  {id: 4, name: "Algeria", code: "DZ"},
  {id: 5, name: "Belarus", code: "BY"},
  {id: 6, name: "Belgium", code: "BE"},
  {id: 7, name: "Belize", code: "BZ"},
  {id: 8, name: "Benin", code: "BJ"},
  {id: 9, name: "China", code: "CN"},
  {id: 10, name: "Christmas Island", code: "CX"},
  {id: 11, name: "Cocos (Keeling) Islands", code: "CC"},
  {id: 12, name: "Djibouti", code: "DJ"},
  {id: 13, name: "Dominica", code: "DM"},
  {id: 14, name: "Dominican Republic", code: "DO"}
];

@Injectable({
  providedIn: 'root'
})
export class CityService {

  BASE_API = 'http://localhost:8080/';

  constructor(private http: HttpClient) { }

  getCities(search: string, type = 'mid'): Observable<City[]> {
    return this.http.get<City[]>(this.BASE_API + `api/cities?search=${search}&searchType=${type}`);
  }

  // Mock method to get List of countries to simulate autocomplete
  getCountries(search: string): Observable<Country[]> {
    return of(MOCK_COUNTRIES.filter(it => it.name.toLowerCase().includes(search.toLowerCase())));
  }
}
