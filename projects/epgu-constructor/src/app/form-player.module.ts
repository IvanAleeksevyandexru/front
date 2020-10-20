import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { EpguLibModule, LoadService, SmuEventsService } from 'epgu-lib';
import { ConfigService } from './config/config.service';
import { FormPlayerComponent } from './form-player.component';
import { AuthInterceptor } from './interceptor/authorization-interceptor';
import { ComponentScreenComponent } from './screen/component-screen/component-screen.component';
import { ComponentScreenModule } from './screen/component-screen/component-screen.module';
import { CustomScreenComponent } from './screen/custom-screen/custom-screen.component';
import { CustomScreenModule } from './screen/custom-screen/custom-screen.module';
import { EmptyScreenComponent } from './screen/empty-screen/empty-screen.component';
import { EmptyScreenModule } from './screen/empty-screen/empty-screen.module';
import { InfoScreenComponent } from './screen/info-screen/info-screen.component';
import { InfoScreenModule } from './screen/info-screen/info-screen.module';
import { InvitationErrorScreenComponent } from './screen/invitation-error-screen/invitation-error-screen.component';
import { InvitationErrorScreenModule } from './screen/invitation-error-screen/invitation-error-screen.module';
import { QuestionsScreenComponent } from './screen/questions-screen/questions-screen.component';
import { QuestionsScreenModule } from './screen/questions-screen/questions-screen.module';
import { ScreenService } from './screen/screen.service';
import { UniqueScreenComponent } from './screen/unique-screen/unique-screen.component';
import { UniqueScreenModule } from './screen/unique-screen/unique-screen.module';
import { DictionaryApiService } from './services/api/dictionary-api/dictionary-api.service';
import { FormPlayerApiService } from './services/api/form-player-api/form-player-api.service';
import { CurrentAnswersService } from './screen/current-answers.service';
import { FormPlayerService } from './services/form-player/form-player.service';
import { ScreenResolverService } from './services/screen-resolver/screen-resolver.service';
import { ServiceDataService } from './services/service-data/service-data.service';
import { UnsubscribeService } from './services/unsubscribe/unsubscribe.service';
import { UtilsService } from './services/utils/utils.service';
import { ToolsService } from './shared/services/tools/tools.service';
import { SharedModule } from './shared/shared.module';
import { ActionApiService } from './services/api/action-api/action-api.service';
import { FormPlayerConfigApiService } from './services/api/form-player-config-api/form-player-config-api.service';
import { initApp } from './form-player.functions';
import { CookieService } from 'ngx-cookie-service';

export const EpguLibModuleInited = EpguLibModule.forRoot();

@NgModule({
  declarations: [
    FormPlayerComponent,
  ],
  imports: [
    CommonModule,
    ComponentScreenModule,
    CustomScreenModule,
    EmptyScreenModule,
    QuestionsScreenModule,
    UniqueScreenModule,
    InvitationErrorScreenModule,
    SharedModule,
    EpguLibModuleInited,
    InfoScreenModule,
  ],
  providers: [
    LoadService,
    FormPlayerConfigApiService,
    DictionaryApiService,
    FormPlayerService,
    FormPlayerApiService,
    ScreenService,
    CookieService,
    SmuEventsService,
    CurrentAnswersService,
    UnsubscribeService,
    ScreenResolverService,
    UtilsService,
    ConfigService,
    ServiceDataService,
    ToolsService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
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
    InfoScreenComponent,
    QuestionsScreenComponent,
    ComponentScreenComponent,
    CustomScreenComponent,
    UniqueScreenComponent,
    InvitationErrorScreenComponent,
    EmptyScreenComponent,
  ]
})
export class FormPlayerModule {}
