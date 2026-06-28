import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardData } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) { }

  getDashboardData(simbolo: string, period: string = '6mo', lang: string = 'en'): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${this.apiUrl}/dashboard/${simbolo}?period=${period}&lang=${lang}`);
  }
}