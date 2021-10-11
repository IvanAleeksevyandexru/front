import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import {
  DeviceDetectorService,
  ERROR_HANDLER_ORDER_PARAMS_SERVICES,
  ERROR_HANDLER_SERVICE,
  HEALTH_SERVICE,
  PREV_BUTTON_NAVIGATION,
  TRACE_ALLOWED_REMOTE_SERVICES,
} from '@epgu/epgu-constructor-ui-kit';
import { AutocompleteService } from './services/autocomplete/autocomplete.service';
import { InitDataService } from './services/init-data/init-data.service';
import { NavigationModalService } from './services/navigation-modal/navigation-modal.service';
import { NavigationService } from './services/navigation/navigation.service';
import { TerraByteApiService } from './services/terra-byte-api/terra-byte-api.service';
import { HttpHeadersInterceptor } from './interceptor/http-headers/http-headers.interceptor';
import { ErrorHandlerService } from './services/error-handler/error-handler.service';
import { PrevButtonNavigationService } from './services/prev-button-navigation/prev-button-navigation.service';
import { HealthHandlerService } from './services/health-handler/health-handler.service';
// eslint-disable-next-line max-len
import { ErrorHandlerOrderParamsServiceService } from './services/error-handler-order-params-service/error-handler-order-params-service.service';
import { DateRefService } from './services/date-ref/date-ref.service';
import { TypeCastService } from './services/type-cast/type-cast.service';
import { HtmlSelectService } from './services/html-select/html-select.service';
import { JsonHelperService } from './services/json-helper/json-helper.service';
import { SmuEventsService } from '@epgu/ui/services/smu-events';

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
    ErrorHandlerService,
    HealthHandlerService,
    DateRefService,
    TypeCastService,
    HtmlSelectService,
    JsonHelperService,
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
      provide: ERROR_HANDLER_SERVICE,
      useClass: ErrorHandlerService,
    },
    {
      provide: ERROR_HANDLER_ORDER_PARAMS_SERVICES,
      useClass: ErrorHandlerOrderParamsServiceService,
    },
    {
      provide: TRACE_ALLOWED_REMOTE_SERVICES,
      useValue: ['api/nsi/v1/dictionary', 'getService', 'getNextStep', 'getPrevStep', 'skipStep'],
    },
  ],
})
export class CoreModule {}
