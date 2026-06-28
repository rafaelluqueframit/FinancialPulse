import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { environment } from '../../enviroments/environment.prod';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Solo añade la URL base si la petición empieza con /api
    if (req.url.startsWith('/api')) {
      const apiReq = req.clone({ url: environment.apiUrl + req.url });
      return next.handle(apiReq);
    }
    return next.handle(req);
  }
}