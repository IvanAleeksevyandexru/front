import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { SmuEventsService } from '@epgu/epgu-lib';
import {
  DeviceDetectorService,
  HEALTH_SERVICE,
  PREV_BUTTON_NAVIGATION,
  TRACE_ALLOWED_REMOTE_SERVICES
} from '@epgu/epgu-constructor-ui-kit';

import { ErrorsInterceptorService } from './interceptor/errors/errors.interceptor';
import { GlobalErrorHandler } from './services/global-error/global-error.service';
import { AutocompleteService } from './services/autocomplete/autocomplete.service';
import { InitDataService } from './services/init-data/init-data.service';
import { NavigationModalService } from './services/navigation-modal/navigation-modal.service';
import { NavigationService } from './services/navigation/navigation.service';
import { TerraByteApiService } from './services/terra-byte-api/terra-byte-api.service';
import { HttpHeadersInterceptor } from './interceptor/http-headers/http-headers.interceptor';
import { ErrorHandleService } from './interceptor/errors/error-handle.service';
import { PrevButtonNavigationService } from './services/prev-button-navigation/prev-button-navigation.service';
import { HealthHandlerService } from './services/health-handler/health-handler.service';
import { FormPlayerNavigation } from '../form-player/form-player.types';

/**
 * Здесь храниться всё providers которые необходимы во всех слоях и должны быть синглетоном.
 */
@NgModule({
  providers: [
    DeviceDetectorService,
    NavigationService,
    NavigationModalService,
    SmuEventsService,
    InitDataService,
    AutocompleteService,
    TerraByteApiService,
    ErrorHandleService,
    HealthHandlerService,
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorsInterceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpHeadersInterceptor,
      multi: true,
    },
    {
      provide: PREV_BUTTON_NAVIGATION,
      useClass: PrevButtonNavigationService,
    },
    {
      provide: HEALTH_SERVICE,
      useClass: HealthHandlerService,
    },
    {
      provide: TRACE_ALLOWED_REMOTE_SERVICES,
      useValue: [
        'api/nsi/v1/dictionary',
        FormPlayerNavigation.NEXT,
        FormPlayerNavigation.PREV,
        FormPlayerNavigation.SKIP,
        'getService',
      ]
    }
  ],
})
export class CoreModule {}
