import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EpguLibModule } from 'epgu-lib';

import { Config } from './config/config.types';
import { FormPlayerComponent } from './form-player.component';
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
import { ComponentStateService } from './services/component-state/component-state.service';
import { ScreenService } from './screen/screen.service';
import { EmptyScreenModule } from './screen/empty-screen/empty-screen.module';
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
    SharedModule,
    EpguLibModule.forRoot(),
    InfoScreenModule,
  ],
  providers: [
    DictionaryApiService,
    FormPlayerService,
    FormPlayerApiService,
    ScreenService,
    ComponentStateService,
    ConfigService,
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
