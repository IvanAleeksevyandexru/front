import { CommonModule } from '@angular/common';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { EpguLibModule, SmuEventsService } from 'epgu-lib';
import { ConfigService } from './config/config.service';
import { FormPlayerComponent } from './form-player.component';
import { FormPlayerApiService } from './services/form-player-api/form-player-api.service';
import { FormPlayerService } from './services/form-player/form-player.service';
import { ServiceDataService } from './services/service-data/service-data.service';
import { UtilsService } from './services/utils/utils.service';
import { SharedModule } from './shared/shared.module';
import { FormPlayerConfigApiService } from './services/form-player-config-api/form-player-config-api.service';
import { initApp } from './form-player.functions';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageService } from './services/storage/local-storage/local-storage.service';
import { CookieStorageService } from './services/storage/cookie-storage/cookie-storage.service';
import { SessionStorageService } from './services/storage/session-storage/session-storage.service';
import { ScreenModule } from './screen/screen.module';

export const EpguLibModuleInited = EpguLibModule.forRoot();

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
    UtilsService, // TODO: подумать над переносом в скрин слой, возможно разделить сервис вынести лоакл сторадж логику
    ConfigService,
    ServiceDataService,

    LocalStorageService,
    CookieStorageService, // TODO: возможно стоит удалить как старое решение
    SessionStorageService, // TODO: возможно стоит удалить как старое решение
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
