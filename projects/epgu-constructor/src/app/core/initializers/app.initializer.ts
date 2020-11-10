import { SmuEventsService } from 'epgu-lib';
import { CookieService } from 'ngx-cookie-service';
import { MOBILE_VIEW_COOKIE_NAME } from '../../shared/constants/cookie';

export function initApp(smuEventsService: SmuEventsService, cookieService: CookieService) {
  return (): Promise<any> => {
    return new Promise((resolve, reject) => {
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
