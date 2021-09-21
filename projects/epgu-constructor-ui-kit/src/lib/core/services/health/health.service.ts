import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { isDevMode } from '@angular/core';
import { LoadService } from '@epgu/ui/services/load';
import { HelperService } from '@epgu/ui/services/helper';

interface EventInfo {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class HealthService {
  private measures: object = {};

  constructor(private route: ActivatedRoute, private loadService: LoadService) {}

  private static request(url: string): void {
    const s = document.createElement('script');
    const x = document.getElementsByTagName('script')[0];
    s.type = 'text/javascript';
    s.async = true;
    s.src = url;
    x.parentNode.insertBefore(s, x);
  }

  public measureStart(id: string): void {
    this.measures[id] = Date.now();
  }

  public measureEnd(id: string, result: number, eventInfo: EventInfo): void {
    const startTime = this.measures[id];
    if (startTime) {
      const delta = Date.now() - startTime;
      this.send(id.replace(/_.+$/g, ''), delta, result, eventInfo);
      delete this.measures[id];
    }
  }

  public measureDomEvents(id: string, eventInfo: EventInfo = {}): void {
    // tslint:disable-next-line:deprecation
    if (window.performance && window.performance.timing) {
      // tslint:disable-next-line:deprecation
      const timingApiObj = window.performance.timing;
      const dcl = timingApiObj.domContentLoadedEventEnd - timingApiObj.navigationStart;
      const complete = timingApiObj.loadEventEnd - timingApiObj.navigationStart;
      this.send(id, dcl, 0, eventInfo);
      this.send(id, complete, 0, eventInfo);
    } else {
      this.send(id, 0, 1, eventInfo);
    }
  }

  public measure(id: string, errorCode: number): void {
    this.send(id, 0, errorCode);
  }

  private send(event: string, time: number, result: number, eventInfo?: EventInfo): void {
    if (isDevMode()) {
      return;
    }

    let utmSource: string;
    const api = this.loadService.config.timingApiUrl;
    if (typeof result === 'undefined') {
      result = 0;
    }

    let pageId = (window.location.pathname + window.location.hash)
      .replace(/[(#\/):\.&\?=]/g, '_')
      .slice(1)
      .toLowerCase();

    if (pageId.indexOf('order') !== -1 || pageId.indexOf('payment') !== -1) {
      const tmpArr = pageId ? pageId.split('_') : [];
      if (tmpArr && tmpArr.length === 4) {
        tmpArr.splice(-1, 1);
        pageId = tmpArr.join('_');
      }
    }

    if (this.loadService.config.viewType === 'PAYMENT') {
      if (pageId) {
        pageId = pageId.replace('pay', 'pay_new');
      } else {
        pageId = 'pay_new';
      }
    }

    if (this.route.snapshot.paramMap.get('utm_source')) {
      utmSource = this.route.snapshot.paramMap.get('utm_source');
    }

    let eventInfoString: string | object = eventInfo;
    if (eventInfo && HelperService.isObject(eventInfo)) {
      eventInfoString = new HttpParams({ fromObject: eventInfo }).toString();
    }

    const url =
      api +
      '?_=' +
      Math.random() +
      '&pageId=' +
      (pageId ? pageId : '_') +
      '&event=' +
      event +
      (utmSource ? '&utm_source=' + utmSource : '') +
      '&timing=' +
      time +
      '&referrer=' +
      document.referrer +
      '&result=' +
      result +
      (eventInfoString ? (eventInfoString ? '&' + eventInfoString : '') : '');
    HealthService.request(url);
  }
}
