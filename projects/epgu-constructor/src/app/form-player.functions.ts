import { LoadService, SmuEventsService } from 'epgu-lib';
import { CookieService } from 'ngx-cookie-service';
import { MOBILE_VIEW_COOKIE_NAME } from './shared/constants/cookie';

export function initApp(smuEventsService: SmuEventsService, cookieService: CookieService) {
  return (): Promise<any> => {
    return new Promise((resolve, reject) => {
      const isMobileView = cookieService.get(MOBILE_VIEW_COOKIE_NAME);
      if (isMobileView) {
        smuEventsService.init();
      }
      resolve();
    });
  };
}
