import { SmuEventsService } from 'epgu-lib';
import { CookieService } from 'ngx-cookie-service';
import { MOBILE_VIEW_COOKIE_NAME } from '../../shared/constants/cookie';
import { AutocompleteService } from '../services/autocomplete/autocomplete.service';

export function initApp(
  smuEventsService: SmuEventsService,
  cookieService: CookieService,
  autocompleteService: AutocompleteService,
) {
  return (): Promise<void> => {
    return new Promise((resolve) => {
      autocompleteService.init();
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
