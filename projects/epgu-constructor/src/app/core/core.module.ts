import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
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
import { HealthInterceptor } from '../form-player/interceptor/health-interceptor';

export const EpguLibModuleInited = EpguLibModule.forRoot();

const COMPONENTS = [
  OutputHtmlComponent
];

const PIPES = [
  ImgPrefixerPipe,
  SafePipe
];


/**
 * Домен ядра. Сдесь храниться всё что необходимо во всех слоях.
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
    SmuEventsService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HealthInterceptor,
      multi: true,
    },
  ]
})
export class CoreModule {}
