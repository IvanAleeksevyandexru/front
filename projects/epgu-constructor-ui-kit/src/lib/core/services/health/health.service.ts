import { Injectable, isDevMode } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpParams } from '@angular/common/http';

import { LoadService } from '@epgu/ui/services/load';
import { HelperService } from '@epgu/ui/services/helper';
import { v4 as uuidv4 } from 'uuid';

export interface EventInfo {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class HealthService {
  private measures: Record<string, number> = {};

  constructor(private route: ActivatedRoute, private loadService: LoadService) {}

  private static request(url: string): void {
    const scriptId = uuidv4();
    const s = document.createElement('script');
    const x = document.getElementsByTagName('script')[0];
    s.type = 'text/javascript';
    s.async = true;
    s.src = url;
    s.setAttribute('id', scriptId);
    x.parentNode.insertBefore(s, x);
    s.remove();
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
    const timing = window?.performance?.timing;
    // tslint:disable-next-line:deprecation
    if (timing) {
      // tslint:disable-next-line:deprecation
      const dcl = timing.domContentLoadedEventEnd - timing.navigationStart;
      const complete = timing.loadEventEnd - timing.navigationStart;
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
    const api = this.loadService.config.timingApiUrl;

    if (isDevMode()) {
      console.log('HEALTH', { event, ...eventInfo });
    }

    if (isDevMode() || !api) {
      return;
    }
    let utmSource: string;
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

    const url = `${api}?_=${Math.random()}&pageId=${pageId || '_'}&event=${event}${
      utmSource ? `&utm_source=${utmSource}` : ''
    }&timing=${time}&referrer=${document.referrer}&result=${result}${
      eventInfoString ? (eventInfoString ? `&${eventInfoString}` : '') : ''
    }`;
    HealthService.request(url);
  }
}
