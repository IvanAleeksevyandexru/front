import { Inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import isMobile, { UserAgent } from 'ismobilejs';
import { SmuEventsService } from '@epgu/ui/services/smu-events';
import { System } from '@epgu/epgu-constructor-types';
import { WINDOW } from '../../providers/window.provider';
import {
  BrowserName,
  MOBILE_VIEW_COOKIE_NAME,
  WEB_VIEW_USER_AGENTS,
} from './device-detector.types';

@Injectable()
export class DeviceDetectorService {
  // Определение платформы работает на backend(-e) на портале, там используется node c пакетом ismobilejs.
  // для локальной работы и для наших стендов используется angular пакет device-detector

  isMobile: boolean;

  isTablet: boolean;

  isDesktop: boolean;

  isWebView: boolean;

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
    this.isMobile = deviceInfo.phone;
    this.isTablet = deviceInfo.tablet;
    this.isDesktop = !this.isMobile && !this.isTablet;
    this.isWebView = this.isWebViewUserAgent() || this.smuEventsService.smuInit;
    this.userAgent = this.window.navigator?.userAgent;
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

  private isWebViewUserAgent(): boolean {
    const webViewRegExp = new RegExp(`(${WEB_VIEW_USER_AGENTS.join('|')})`, 'ig');

    return !!this.userAgent?.match(webViewRegExp);
  }
}
