import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DynamicModule } from 'ng-dynamic-component';
import { EpguLibModule } from 'epgu-lib';

import { FormPlayerConfigInterface } from '../interfaces/form-player-config.interface';
import { FormPlayerComponent } from './form-player.component';
import { LayoutModule } from './layout/layout.module';
import { CustomScreenModule } from './screen/custom-screen/custom-screen.module';
import { InfoScreenModule } from './screen/info-screen/info-screen.module';
import { InvitationErrorScreenModule } from './screen/invitation-error-screen/invitation-error-screen.module';
import { QuestionsScreenModule } from './screen/questions-screen/questions-screen.module';
import { ComponentScreenModule } from './screen/component-screen/component-screen.module';
import { UniqueScreenModule } from './screen/unique-screen/unique-screen.module';
import { ConstructorConfigService } from './services/config/constructor-config.service';
import { CONSTRUCTOR_CONFIG_TOKEN } from './services/config/constructor.config.token';
import { FormPlayerService } from './services/form-player/form-player.service';
import { DictionaryApiService } from './services/dictionary-api/dictionary-api.service';
import { UnsubscribeService } from './services/unsubscribe/unsubscribe.service';
import { SharedModule } from './shared/shared.module';
import { TerabyteService } from './services/terabyte/terabyte.service';
import { ComponentStateService } from './services/component-state/component-state.service';
import { ScreenService } from './screen/screen.service';
import { ScreenResolverService } from './services/screen-resolver/screen-resolver.service';
import { EmptyScreenModule } from './screen/empty-screen/empty-screen.module';
import { UserSessionService } from './services/user-session/user-session.service';
import { FormPlayerApiService } from './services/form-player-api/form-player-api.service';


const COMPONENTS = [
  FormPlayerComponent
];

@NgModule({
  declarations: [
    ...COMPONENTS,
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
    ConstructorConfigService,
    UserSessionService,
    UnsubscribeService
  ],
  exports: [
    ...COMPONENTS
  ]
})

export class FormPlayerModule {

  static forRoot(formPlayerConfig: FormPlayerConfigInterface) {
    return {
      ngModule: FormPlayerModule,
      providers: [
        {
          provide: CONSTRUCTOR_CONFIG_TOKEN,
          useValue: formPlayerConfig
        },
        FormPlayerService,
      ]
    };
  }
}
