import { CommonModule } from '@angular/common';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EpguLibModule, SmuEventsService } from 'epgu-lib';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { OutputHtmlComponent } from './components/output-html/output-html.component';
import { ImgPrefixerPipe } from './pipes/img-prefixer/img-prefixer.pipe';
import { SafePipe } from './pipes/safe/safe.pipe';
import { ConfigService } from './config/config.service';
import { DeviceDetectorService } from './services/device-detector/device-detector.service';
import { NavigationService } from './services/navigation/navigation.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NavigationModalService } from './services/navigation-modal/navigation-modal.service';
import { ErrorsInterceptorService } from './interceptor/errors/errors.interceptor';
import { initApp } from './initializers/app.initializer';
import { CookieService } from 'ngx-cookie-service';
import { HealthInterceptor } from './interceptor/health/health.interceptor';
import { WINDOW_PROVIDERS } from './providers/window.provider';
import { LoggerService } from './services/logger/logger.service';

export const EpguLibModuleInited = EpguLibModule.forRoot();

const COMPONENTS = [
  OutputHtmlComponent
];

const PIPES = [
  ImgPrefixerPipe,
  SafePipe
];


/**
 * Домен ядра. Здесь храниться всё что необходимо во всех слоях.
 */
@NgModule({
  declarations: [
    ...COMPONENTS,
    ...PIPES
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EpguLibModuleInited,
    PerfectScrollbarModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EpguLibModule,
    PerfectScrollbarModule,
    ...COMPONENTS,
    ...PIPES
  ],
  providers: [
    ConfigService,
    DeviceDetectorService,
    NavigationService,
    NavigationModalService,
    SmuEventsService,
    LoggerService,
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
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [SmuEventsService, CookieService],
      multi: true
    },
    WINDOW_PROVIDERS
  ]
})
export class CoreModule {}
