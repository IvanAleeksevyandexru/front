import { Inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import isMobile from 'ismobilejs';
import { SmuEventsService } from '@epgu/ui/services/smu-events';
import { System } from '@epgu/epgu-constructor-types';
import { WINDOW } from '../../providers/window.provider';

export const MOBILE_VIEW_COOKIE_NAME = 'mobVersion';

@Injectable()
export class DeviceDetectorService {
  // Определение платформы работает на backend(-e) на портале, там используется node c пакетом ismobilejs.
  // для локальной работы и для наших стендов используется angular пакет device-detector

  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isWebView: boolean;

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
    this.isWebView = this.smuEventsService.smuInit;
  }

  /**
   * Возвращает IOS в браузере Chrome это или нет
   */
  isChromeIOS(): boolean {
    return /CriOS\/[\d]+/.test(this.window.navigator.userAgent);
  }

  /**
   * Возвращает Android в браузере Mi это или нет
   */
  isMiAndroid(): boolean {
    return /XiaoMi\/+/.test(this.window.navigator.userAgent);
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

    const userAgent = this.window.navigator?.userAgent;

    if (!userAgent) {
      return System.Error;
    }

    if (/android/i.test(userAgent)) {
      return System.Android;
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return System.iOS;
    } else if (/Harmony|harmony/.test(userAgent)) {
      return System.Harmony;
    }

    return System.NotDetermined;
  }
}
