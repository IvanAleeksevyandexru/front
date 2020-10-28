import { CommonModule } from '@angular/common';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { EpguLibModule, SmuEventsService } from 'epgu-lib';
import { ConfigService } from '../shared/config/config.service';
import { FormPlayerComponent } from './form-player.component';
import { FormPlayerApiService } from './services/form-player-api/form-player-api.service';
import { FormPlayerService } from './services/form-player/form-player.service';
import { ServiceDataService } from './services/service-data/service-data.service';
import { SharedModule } from '../shared/shared.module';
import { FormPlayerConfigApiService } from './services/form-player-config-api/form-player-config-api.service';
import { initApp } from './form-player.functions';
import { CookieService } from 'ngx-cookie-service';
import { ScreenModule } from '../screen/screen.module';

const EpguLibModuleInited = EpguLibModule.forRoot();

/**
 * Домен форм плеера. Сдесь храняться всё что связано с форм плеером, его интеграцие с форм плеер апи.
 */
@NgModule({
  declarations: [
    FormPlayerComponent,
  ],
  imports: [
    ScreenModule,
    CommonModule,
    SharedModule,
    EpguLibModuleInited,
  ],
  providers: [
    FormPlayerConfigApiService,
    FormPlayerService,
    FormPlayerApiService,
    CookieService,
    SmuEventsService,
    ConfigService,
    ServiceDataService,
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [SmuEventsService, CookieService],
      multi: true
    },
  ],
  exports: [
    FormPlayerComponent,
  ],
  entryComponents: [
    FormPlayerComponent,
  ]
})
export class FormPlayerModule {}
