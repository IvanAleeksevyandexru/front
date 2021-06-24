import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { InitDataService } from '../../services/init-data/init-data.service';
import { LocationService } from '@epgu/epgu-constructor-ui-kit';

@Injectable()
export class HttpHeadersInterceptor implements HttpInterceptor {
  private readonly paths = ['nsi/v1/dictionary', 'v1/equeue/agg/slots', 'v1/equeue/agg/book'];

  constructor(private init: InitDataService, private locationService: LocationService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const isNeedUpdateHeaders = this.paths.some((path) => request.url.includes(path));
    if (isNeedUpdateHeaders) {
      const pageId = this.locationService.path().slice(1).split('/', 2).join('/');
      const cloneReq = request.clone({
        setHeaders: {
          'X-ORDER-ID': `${this.init.orderId}`,
          'X-FORM-ID': pageId,
        },
      });

      return next.handle(cloneReq);
    }

    return next.handle(request);
  }
}
