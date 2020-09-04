import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DynamicModule } from 'ng-dynamic-component';
import { EpguLibModule } from 'epgu-lib';

import { Config } from './config/config.types';
import { FormPlayerComponent } from './form-player.component';
import { LayoutModule } from './layout/layout.module';
import { CustomScreenModule } from './screen/custom-screen/custom-screen.module';
import { InfoScreenModule } from './screen/info-screen/info-screen.module';
import { InvitationErrorScreenModule } from './screen/invitation-error-screen/invitation-error-screen.module';
import { QuestionsScreenModule } from './screen/questions-screen/questions-screen.module';
import { ComponentScreenModule } from './screen/component-screen/component-screen.module';
import { UniqueScreenModule } from './screen/unique-screen/unique-screen.module';
import { ConfigService } from './config/config.service';
import { CONFIG_TOKEN } from './config/config.token';
import { FormPlayerService } from './services/form-player/form-player.service';
import { DictionaryApiService } from './services/api/dictionary-api/dictionary-api.service';
import { UnsubscribeService } from './services/unsubscribe/unsubscribe.service';
import { SharedModule } from './shared/shared.module';
import { TerabyteService } from './services/terabyte/terabyte.service';
import { ComponentStateService } from './services/component-state/component-state.service';
import { ScreenService } from './screen/screen.service';
import { ScreenResolverService } from './services/screen-resolver/screen-resolver.service';
import { EmptyScreenModule } from './screen/empty-screen/empty-screen.module';
import { UserSessionService } from './services/user-session/user-session.service';
import { FormPlayerApiService } from './services/api/form-player-api/form-player-api.service';


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
    LayoutModule,
    DynamicModule,
    SharedModule,
    EpguLibModule.forChild(),
    InfoScreenModule,
  ],
  providers: [
    DictionaryApiService,
    TerabyteService,
    FormPlayerService,
    FormPlayerApiService,
    ScreenResolverService,
    ScreenService,
    ComponentStateService,
    ConfigService,
    UserSessionService,
    UnsubscribeService
  ],
  exports: [
    FormPlayerComponent
  ]
})
export class FormPlayerModule {
  static forRoot(config: Config) {
    return {
      ngModule: FormPlayerModule,
      providers: [
        {
          provide: CONFIG_TOKEN,
          useValue: config
        },
        FormPlayerService,
      ]
    };
  }
}
