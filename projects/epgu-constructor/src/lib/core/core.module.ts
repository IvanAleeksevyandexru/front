import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { SmuEventsService } from '@epgu/epgu-lib';
import { ErrorsInterceptorService } from './interceptor/errors/errors.interceptor';
import { HealthInterceptor } from './interceptor/health/health.interceptor';
import { HttpCancelInterceptor } from './interceptor/http-cancel/http-cancel.interceptor';
import { GlobalErrorHandler } from './services/global-error/global-error.service';
import { AutocompleteService } from './services/autocomplete/autocomplete.service';
import { DeviceDetectorService } from '@epgu/epgu-constructor-ui-kit';
import { InitDataService } from './services/init-data/init-data.service';
import { NavigationModalService } from './services/navigation-modal/navigation-modal.service';
import { NavigationService } from './services/navigation/navigation.service';
import { SessionService } from './services/session/session.service';
import { UtilsService } from './services/utils/utils.service';
import { TerraByteApiService } from './services/terra-byte-api/terra-byte-api.service';
import { TracingService } from './services/tracing/tracing.service';
import { TracingHttpInterceptor } from './interceptor/tracing/tracing.interceptor';
import { FocusManagerService } from './services/focus-manager/focus-manager.service';
import { HttpHeadersInterceptor } from './interceptor/http-headers.interceptor';
import { ErrorHandleService } from './interceptor/errors/error-handle.service';

/**
 * Здесь храниться всё providers которые необходимы во всех слоях и должны быть синглетоном.
 */
@NgModule({
  providers: [
    DeviceDetectorService,
    NavigationService,
    NavigationModalService,
    SmuEventsService,
    UtilsService,
    SessionService,
    InitDataService,
    AutocompleteService,
    TerraByteApiService,
    TracingService,
    FocusManagerService,
    ErrorHandleService,
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
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TracingHttpInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpHeadersInterceptor,
      multi: true,
    },
  ],
})
export class CoreModule {}
