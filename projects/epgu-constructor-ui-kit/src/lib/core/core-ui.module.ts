import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { SmuEventsService } from '@epgu/epgu-lib';
import { CookieService } from 'ngx-cookie-service';

// Сокращать пути до ./components и ./services нельзя, т.к. будет ошибка при `ng build epgu-constructor --prod`
import { CfAppStateService } from './services/cf-app-state/cf-app-state.service';
import { LocalStorageService } from './services/local-storage/local-storage.service';
import { SessionStorageService } from './services/session-storage/session-storage.service';
import { LocationService } from './services/location/location.service';
import { WINDOW_PROVIDERS } from './providers/window.provider';
import { DeviceDetectorService } from './services/device-detector/device-detector.service';
import { EventBusService } from './services/event-bus/event-bus.service';
import { UnsubscribeService } from './services/unsubscribe/unsubscribe.service';
import { ConfigService } from './services/config/config.service';
import { LoggerService } from './services/logger/logger.service';
import { initApp } from './initializers/app.initializer';
import { HttpCancelInterceptor } from './interceptor/http-cancel/http-cancel.interceptor';
import { HttpCancelService } from './interceptor/http-cancel/http-cancel.service';
import { SessionService } from './services/session/session.service';
import { FocusManagerService } from './services/focus-manager/focus-manager.service';
import { DatesToolsService } from './services/dates-tools/dates-tools.service';
import { DownloadService } from './services/download/download.service';
import { ModalService } from '../modal/modal.service';
import { HealthInterceptor } from './interceptor/health/health.interceptor';
import { ConfigApiService } from './services/config-api/config-api.service';
import { TracingHttpInterceptor } from './interceptor/tracing/tracing.interceptor';
import { TracingService } from './services/tracing/tracing.service';
import { GlobalErrorHandler } from './services/global-error/global-error.service';
import { ErrorsInterceptor } from './interceptor/errors/errors.interceptor';
import { AddressesToolsService } from './services/addresses-tools/addresses-tools.service';
import { HealthService } from './services/health/health.service';
import { ObjectHelperService } from './services/object-helper/object-helper.service';
import { WordTransformService } from './services/word-transform/word-transform.service';
import { ServiceNameService } from './services/service-name/service-name.service';

@NgModule({
  providers: [
    ModalService,
    LocalStorageService,
    SessionStorageService,
    DeviceDetectorService,
    EventBusService,
    UnsubscribeService,
    CfAppStateService,
    LocationService,
    ConfigService,
    ConfigApiService,
    LoggerService,
    HttpCancelService,
    SessionService,
    FocusManagerService,
    DatesToolsService,
    HttpClient,
    DownloadService,
    ObjectHelperService,
    WordTransformService,
    TracingService,
    AddressesToolsService,
    HealthService,
    ServiceNameService,
    WINDOW_PROVIDERS,
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpCancelInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HealthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TracingHttpInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorsInterceptor,
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [SmuEventsService, CookieService],
      multi: true,
    },
  ],
})
export class CoreUiModule {}
