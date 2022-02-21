import { SmuEventsService } from '@epgu/ui/services/smu-events';
import { CookieService } from 'ngx-cookie-service';
import { MOBILE_VIEW_COOKIE_NAME } from '../services/device-detector/device-detector.types';

export function initApp(smuEventsService: SmuEventsService, cookieService: CookieService) {
  return (): Promise<void> => {
    return new Promise((resolve) => {
      const isMobileView = cookieService.get(MOBILE_VIEW_COOKIE_NAME);
      if (isMobileView) {
        smuEventsService.init();
      }
      resolve();
    });
  };
}
