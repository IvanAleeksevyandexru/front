import { InjectionToken } from '@angular/core';
import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

export const HEALTH_SERVICE = new InjectionToken<string>('epguHealthService');

export interface HealthHandler {
  handleRequest: (req: HttpRequest<unknown>, next: HttpHandler) => Observable<HttpEvent<unknown>>;
}
