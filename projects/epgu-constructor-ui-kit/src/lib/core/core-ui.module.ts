import { APP_INITIALIZER, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { SmuEventsService } from '@epgu/epgu-lib';
import { CookieService } from 'ngx-cookie-service';

// Сокращать пути до ./components и ./services нельзя, т.к. будет ошибка при `ng build epgu-constructor --prod`
import { CfAppStateService } from './services/cf-app-state/cf-app-state.service';
import { LocalStorageService } from './services/local-storage/local-storage.service';
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
import { UtilsService } from './services/utils/utils.service';
import { ModalService } from '../modal/modal.service';

@NgModule({
  providers: [
    ModalService,
    LocalStorageService,
    DeviceDetectorService,
    EventBusService,
    UnsubscribeService,
    CfAppStateService,
    LocationService,
    ConfigService,
    LoggerService,
    HttpCancelService,
    SessionService,
    FocusManagerService,
    DatesToolsService,
    HttpClient,
    UtilsService,
    WINDOW_PROVIDERS,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpCancelInterceptor,
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
