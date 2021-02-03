import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { SmuEventsService } from 'epgu-lib';
import { CookieService } from 'ngx-cookie-service';
import { initApp } from './initializers/app.initializer';
import { ErrorsInterceptorService } from './interceptor/errors/errors.interceptor';
import { HealthInterceptor } from './interceptor/health/health.interceptor';
import { HttpCancelInterceptor } from './interceptor/http-cancel/http-cancel.interceptor';
import { GlobalErrorHandler } from './services/global-error/global-error.service';
import { WINDOW_PROVIDERS } from './providers/window.provider';
import { AutocompleteService } from './services/autocomplete/autocomplete.service';
import { ConfigService } from './services/config/config.service';
import { DeviceDetectorService } from './services/device-detector/device-detector.service';
import { InitDataService } from './services/init-data/init-data.service';
import { LocalStorageService } from './services/local-storage/local-storage.service';
import { LocationService } from './services/location/location.service';
import { LoggerService } from './services/logger/logger.service';
import { NavigationModalService } from './services/navigation-modal/navigation-modal.service';
import { NavigationService } from './services/navigation/navigation.service';
import { SessionService } from './services/session/session.service';
import { UtilsService } from './services/utils/utils.service';

/**
 * Здесь храниться всё providers которые необходимы во всех слоях и должны быть синглетоном.
 */
@NgModule({
  providers: [
    ConfigService,
    DeviceDetectorService,
    NavigationService,
    NavigationModalService,
    SmuEventsService,
    LoggerService,
    LocalStorageService,
    UtilsService,
    SessionService,
    InitDataService,
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HealthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorsInterceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpCancelInterceptor,
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [SmuEventsService, CookieService],
      multi: true,
    },
    WINDOW_PROVIDERS,
    LocationService,
  ],
})
export class CoreModule {}
