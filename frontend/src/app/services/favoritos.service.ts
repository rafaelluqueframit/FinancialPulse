import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FavoritosService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  getFavoritos(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/favoritos`);
  }

  addFavorito(simbolo: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/favoritos`, { simbolo });
  }

  removeFavorito(simbolo: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/favoritos/${simbolo}`);
  }
}