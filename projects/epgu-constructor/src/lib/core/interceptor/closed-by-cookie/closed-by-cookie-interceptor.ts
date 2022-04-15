import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DeviceDetectorService, LocationService } from '@epgu/epgu-constructor-ui-kit';

const CLOSED_BY_COOKIE_FLAG_NAME = 'closedByCookie';

@Injectable()
export class ClosedByCookieInterceptor implements HttpInterceptor {
  private readonly paths = ['scenario/checkIfOrderIdExists'];

  constructor(
    private locationService: LocationService,
    private deviceDetector: DeviceDetectorService,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const canBeClosedByCookie = this.paths.some((path) => request.url.includes(path));
    if (canBeClosedByCookie) {
      return next.handle(request).pipe(
        tap((event) => {
          if (event instanceof HttpResponse && this.shouldBeClosed(event)) {
            this.locationService.href('/');
          }
        }),
      );
    }

    return next.handle(request);
  }

  private shouldBeClosed(event: HttpResponse<unknown>): boolean {
    return event.body && event.body[CLOSED_BY_COOKIE_FLAG_NAME] && !this.deviceDetector.isWebView;
  }
}
