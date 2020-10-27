import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CookieService } from 'ngx-cookie-service';
import { ConfigService } from '../config/config.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private cookieService: CookieService, private config: ConfigService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.checkForbiddenURLs(req.url)) {
      req = req.clone({
        setHeaders: {
          'Content-Type': 'application/json; charset=utf-8',
          Accept: 'application/json',
          Authorization: `Bearer ${this.cookieService.get('acc_t')}`,
        },
      });
    }

    return next.handle(req);
  }

  /**
   * Возвращает true если url "хороший". У запрещенных нужно не отправлять header Authorization
   * иначе РТ лабс ругается “Forbidden for scope”
   * @param url url куда идет запрос.
   */
  private checkForbiddenURLs(url: string): boolean {
    return !url.includes(this.config.fileUploadApiUrl)
      && !url.includes(this.config.timeSlotApiUrl)
      && !url.includes(this.config.paymentUrl);
  }
}
