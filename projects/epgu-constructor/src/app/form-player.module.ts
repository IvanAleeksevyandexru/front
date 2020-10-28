import { CommonModule } from '@angular/common';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { EpguLibModule, SmuEventsService } from 'epgu-lib';
import { ConfigService } from './config/config.service';
import { FormPlayerComponent } from './form-player.component';
import { ScreenService } from './screen/screen.service';
import { DictionaryApiService } from './services/api/dictionary-api/dictionary-api.service';
import { FormPlayerApiService } from './services/api/form-player-api/form-player-api.service';
import { CurrentAnswersService } from './screen/current-answers.service';
import { FormPlayerService } from './services/form-player/form-player.service';
import { ServiceDataService } from './services/service-data/service-data.service';
import { UnsubscribeService } from './services/unsubscribe/unsubscribe.service';
import { UtilsService } from './services/utils/utils.service';
import { ToolsService } from './shared/services/tools/tools.service';
import { SharedModule } from './shared/shared.module';
import { ActionApiService } from './services/api/action-api/action-api.service';
import { FormPlayerConfigApiService } from './services/api/form-player-config-api/form-player-config-api.service';
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
    DictionaryApiService,
    FormPlayerService,
    FormPlayerApiService,
    ScreenService,
    CookieService,
    SmuEventsService,
    CurrentAnswersService,
    UnsubscribeService,
    UtilsService,
    ConfigService,
    ServiceDataService,
    ToolsService,
    LocalStorageService,
    CookieStorageService,
    SessionStorageService,
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [SmuEventsService, CookieService],
      multi: true
    },
    ActionApiService,
  ],
  exports: [
    FormPlayerComponent,
  ],
  entryComponents: [
    FormPlayerComponent,
  ]
})
export class FormPlayerModule {}
