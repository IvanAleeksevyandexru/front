import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HealthHandler } from '@epgu/epgu-constructor-ui-kit';

@Injectable()
export class HealthHandlerService implements HealthHandler {
  public handleRequest(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    console.log('Children clubs health service here!!!');
    return next.handle(request);
  }
}
