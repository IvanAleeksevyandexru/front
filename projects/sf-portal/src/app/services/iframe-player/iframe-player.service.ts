import { Injectable } from '@angular/core';
import { ServerFormDataEmbedding } from '../../components/new-sf-player/cards-forms.service';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../environments/environment';
import { LoggerService } from '@epgu/epgu-constructor-ui-kit';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class IframePlayerService {
  public get hasIframe(): boolean {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }

  hasAcceptedData$ = new BehaviorSubject<boolean>(false);

  public serviceData: ServerFormDataEmbedding;

  constructor(private cookieService: CookieService, private loggerService: LoggerService) {}

  /**
   * Инициализация встроенного в iframe приложения
   * @private
   */
  public initIframeEmbedding() {
    window.parent.postMessage('initEPGU', '*');
    if (window.addEventListener) {
      window.addEventListener('message', this.handleMessage.bind(this), false);
      // @ts-ignore
    } else if (window.attachEvent) {
      // @ts-ignore
      window.attachEvent('onmessage', this.handleMessage.bind(this));
    }
  }

  private handleMessage(event: MessageEvent<ServerFormDataEmbedding>): void {
    if (typeof event.data === 'object' && 'serviceId' in event.data && 'targetId' in event.data) {
      this.cookieService.set('acc_t', event.data.authToken, {
        domain: environment.name !== 'local' ? '.gosuslugi.ru' : '.test.gosuslugi.ru',
        path: '/',
      });
      delete event.data.authToken;
      this.serviceData = event.data;
      this.hasAcceptedData$.next(true);
    }
  }
}
