import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarteraService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  getCartera(): Observable<any> {
    return this.http.get(`${this.apiUrl}/cartera`);
  }

  comprar(simbolo: string, cantidad: number, precio: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/comprar`, { simbolo, cantidad, precio });
  }

  getTransacciones(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/transacciones`);
  }

  vender(simbolo: string, cantidad: number, precio: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/vender`, { simbolo, cantidad, precio });
  }

  getPosicion(): Observable<any> {
    return this.http.get(`${this.apiUrl}/posicion`);
  }
}