import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DynamicModule } from 'ng-dynamic-component';
import { EpguLibModule } from 'epgu-lib';

import { ConstructorConfigInterface } from '../interfaces/constructor-config.interface';
import { ConstructorComponent } from './constructor.component';
import { LayoutModule } from './layout/layout.module';
import { CustomScreenModule } from './screens/custom-screen/custom-screen.module';
import { InfoScreenModule } from './screens/info-screen/info-screen.module';
import { InvitationErrorScreenModule } from './screens/invitation-error-screen/invitation-error-screen.module';
import { QuestionsScreenModule } from './screens/questions-screen/questions-screen.module';
import { ComponentScreenModule } from './screens/component-screen/component-screen.module';
import { UniqueScreenModule } from './screens/unique-screen/unique-screen.module';
import { ConstructorConfigService } from './services/config/constructor-config.service';
import { CONSTRUCTOR_CONFIG_TOKEN } from './services/config/constructor.config.token';
import { ConstructorService } from './services/constructor/constructor.service';
import { MockService } from './services/mock/mock.service';
import { RestService } from './services/rest/rest.service';
import { UnsubscribeService } from './services/unsubscribe/unsubscribe.service';
import { SharedModule } from './shared/shared.module';
import { TerabyteService } from './services/terabyte/terabyte.service';
import { ComponentStateService } from './services/component-state/component-state.service';
import { ScreenService } from './services/screen/screen.service';


const COMPONENTS = [
  ConstructorComponent
];

@NgModule({
  declarations: [
    ...COMPONENTS,
  ],
  imports: [
    CommonModule,
    ComponentScreenModule,
    CustomScreenModule,
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
    RestService,
    TerabyteService,
    ConstructorService,
    ScreenService,
    ComponentStateService,
    ConstructorConfigService,
    UnsubscribeService,
    MockService,
  ],
  exports: [
    ...COMPONENTS
  ]
})

export class ConstructorModule {

  static forRoot(constructorConfig: ConstructorConfigInterface) {
    return {
      ngModule: ConstructorModule,
      providers: [
        {
          provide: CONSTRUCTOR_CONFIG_TOKEN,
          useValue: constructorConfig
        },
        ConstructorService,
      ]
    };
  }
}
