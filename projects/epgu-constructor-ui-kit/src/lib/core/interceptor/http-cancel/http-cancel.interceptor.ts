import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { HttpCancelService } from './http-cancel.service';

@Injectable()
export class HttpCancelInterceptor implements HttpInterceptor {
  constructor(private httpCancelService: HttpCancelService) {}

  intercept<T>(req: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<T>> {
    return next.handle(req).pipe(takeUntil(this.httpCancelService.onCancelPendingRequests()));
  }
}
