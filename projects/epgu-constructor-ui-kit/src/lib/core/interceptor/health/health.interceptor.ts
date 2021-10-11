import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HEALTH_SERVICE, HealthHandler } from './health.token';

@Injectable()
export class HealthInterceptor implements HttpInterceptor {
  constructor(@Inject(HEALTH_SERVICE) private service: HealthHandler) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.service.handleRequest(request, next);
  }
}
