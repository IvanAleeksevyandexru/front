import { Inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import isMobile, { UserAgent } from 'ismobilejs';
import { SmuEventsService } from '@epgu/ui/services/smu-events';
import { System } from '@epgu/epgu-constructor-types';
import { WINDOW } from '../../providers/window.provider';
import {
  BrowserName,
  MOBILE_VIEW_COOKIE_NAME,
  BRAND_SPECIFIC_WEB_VIEW_USER_AGENTS,
} from './device-detector.types';

@Injectable()
export class DeviceDetectorService {
  isMobile: boolean;

  isTablet: boolean;

  isDesktop: boolean;

  isWebView: boolean;

  isBrandSpecificWebView: boolean;

  userAgent: UserAgent;

  constructor(
    private smuEventsService: SmuEventsService,
    private cookieService: CookieService,
    @Inject(WINDOW) private window: Window,
  ) {
    this.initSmuEventsService();
    this.initState();
  }

  /**
   * Инициализирует типы устройства с которого смотрим
   */
  initState(): void {
    const deviceInfo = isMobile(this.window.navigator);
    this.userAgent = this.window.navigator?.userAgent;
    this.isMobile = deviceInfo.phone;
    this.isTablet = deviceInfo.tablet;
    this.isDesktop = !this.isMobile && !this.isTablet;
    this.isBrandSpecificWebView = this.isBrandSpecificWebViewUserAgent();
    this.isWebView = this.smuEventsService.smuInit;
  }

  isIOS(): boolean {
    return (
      ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(
        navigator.platform,
      ) || navigator.userAgent.includes('Mac')
    );
  }

  /**
   * Возвращает IOS в браузере Chrome это или нет
   */
  isChromeIOS(): boolean {
    return /CriOS\/[\d]+/.test(this.userAgent);
  }

  /**
   * Возвращает Android в браузере Mi это или нет
   */
  isMiAndroid(): boolean {
    return /XiaoMi\/+/.test(this.userAgent);
  }

  initSmuEventsService(): void {
    const isMobileView = this.cookieService.get(MOBILE_VIEW_COOKIE_NAME);

    if (isMobileView) {
      this.smuEventsService.init();
    }
  }

  get system(): System {
    if (this.isDesktop) {
      return System.Desktop;
    }

    if (!this.userAgent) {
      return System.Error;
    }

    if (/android/i.test(this.userAgent)) {
      return System.Android;
    }
    if (/iPad|iPhone|iPod/.test(this.userAgent) && !window.MSStream) {
      return System.iOS;
    }
    if (/Harmony|harmony/.test(this.userAgent)) {
      return System.Harmony;
    }

    return System.NotDetermined;
  }

  get browser(): BrowserName {
    if (/Chrom(e|ium)/i.test(this.userAgent)) {
      return BrowserName.CHROME;
    } else if (
      /iP(ad|od|hone)/i.test(this.userAgent) &&
      /WebKit/i.test(this.userAgent) &&
      !/(CriOS|FxiOS|OPiOS|mercury)/i.test(this.userAgent)
    ) {
      return BrowserName.MOBILE_SAFARI;
    } else if (/Safari/i.test(this.userAgent)) {
      return BrowserName.DESKTOP_SAFARI;
    } else if (/Firefox/i.test(this.userAgent)) {
      return BrowserName.FIREFOX;
    } else {
      return BrowserName.ETC;
    }
  }

  private isBrandSpecificWebViewUserAgent(): boolean {
    const regExp = new RegExp(`(${BRAND_SPECIFIC_WEB_VIEW_USER_AGENTS.join('|')})`, 'ig');

    return !!this.userAgent?.match(regExp);
  }
}
