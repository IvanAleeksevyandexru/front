import { Injectable } from '@angular/core';
import { ServerFormDataEmbedding } from '../../components/new-sf-player/cards-forms.service';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../environments/environment';

@Injectable()
export class IframePlayerService {
  public get hasIframe(): boolean {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }

  public serviceData: ServerFormDataEmbedding;

  constructor(private cookieService: CookieService) {}

  /**
   * Инициализация встроенного в iframe приложения
   * @private
   */
  public initIframeEmbedding() {
    console.log('initIframeEmbedding', ' ---- IFRAME_STATE');
    window.parent.postMessage('initEPGU');
    if (window.addEventListener) {
      window.addEventListener('message', this.handleMessage.bind(this), false);
      // @ts-ignore
    } else if (window.attachEvent) {
      // @ts-ignore
      window.attachEvent('onmessage', this.handleMessage.bind(this));
    }
  }

  private handleMessage(event: MessageEvent<ServerFormDataEmbedding>): void {
    console.log('handleMessage event -> ', event, ' ---- IFRAME_STATE');
    console.log(
      'domain -> ',
      environment.name !== 'local' ? '.gosuslugi.ru' : '.test.gosuslugi.ru',
      ' ---- IFRAME_STATE',
    );
    if (typeof event.data === 'object' && 'serviceId' in event.data && 'targetId' in event.data) {
      this.cookieService.set('acc_t', event.data.authToken, {
        domain: environment.name !== 'local' ? '.gosuslugi.ru' : '.test.gosuslugi.ru',
        path: '/',
      });
      delete event.data.authToken;
      this.serviceData = event.data;
    }
  }
}
