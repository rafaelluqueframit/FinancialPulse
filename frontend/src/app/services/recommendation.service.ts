// frontend/src/app/services/recommendation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) { }

  getRecommendation(symbol: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/recommendation/${symbol}`);
  }
}