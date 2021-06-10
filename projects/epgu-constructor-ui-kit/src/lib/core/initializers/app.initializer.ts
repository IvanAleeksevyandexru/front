import { SmuEventsService } from '@epgu/epgu-lib';
import { CookieService } from 'ngx-cookie-service';
import { MOBILE_VIEW_COOKIE_NAME } from '../services/device-detector/device-detector.service';

export function initApp(smuEventsService: SmuEventsService, cookieService: CookieService) {
  return (): Promise<void> => {
    return new Promise((resolve) => {
      /**
       * Bозможно речь идёт о WebView, окно браузера которое открывается в мобильном приложении.
       */
      const isMobileView = cookieService.get(MOBILE_VIEW_COOKIE_NAME);
      if (isMobileView) {
        smuEventsService.init();
      }
      resolve();
    });
  };
}
