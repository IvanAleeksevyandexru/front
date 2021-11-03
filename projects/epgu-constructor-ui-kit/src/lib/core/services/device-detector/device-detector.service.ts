import { Injectable } from '@angular/core';
import { LoadService } from '@epgu/ui/services/load';
import { SmuEventsService } from '@epgu/ui/services/smu-events';
import { CookieService } from 'ngx-cookie-service';
import { LOCAL_STORAGE_PLATFORM_TYPE } from '../config/config.types';
import { LoadServiceDeviceType, System } from './device-detector.types';

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
    private loadService: LoadService,
    private smuEventsService: SmuEventsService,
    private cookieService: CookieService,
  ) {
    this.initSmuEventsService();
    this.initState();
  }

  /**
   * Инициализирует типы устройства с которого смотрим
   */
  initState(): void {
    const {
      deviceType = localStorage.getItem(LOCAL_STORAGE_PLATFORM_TYPE),
    } = this.loadService.attributes;
    this.isMobile = deviceType === LoadServiceDeviceType.mob;
    this.isTablet = deviceType === LoadServiceDeviceType.tab;
    this.isDesktop = false;
    this.isWebView = this.smuEventsService.smuInit;
  }

  /**
   * Возвращает IOS в браузере Chrome это или нет
   */
  isChromeIOS(): boolean {
    return /CriOS\/[\d]+/.test(navigator.userAgent);
  }

  /**
   * Возвращает Android в браузере Mi это или нет
   */
  isMiAndroid(): boolean {
    return /XiaoMi\/+/.test(navigator.userAgent);
  }

  initSmuEventsService(): void {
    const isMobileView = this.cookieService.get(MOBILE_VIEW_COOKIE_NAME);

    if (isMobileView) {
      this.smuEventsService.init();
    }
  }

  /**
   * Возвращает название операционной системы пользователя
   */
  get system(): string | null {
    const userAgent = navigator?.userAgent;

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
