import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EpguLibModule } from 'epgu-lib';
import { ConstructorConfigInterface } from '../interfaces/constructor-config.interface';
import { ConstructorComponent } from './constructor.component';
import { LayoutModule } from './layout/layout.module';
import { CustomScreenModule } from './modules/custom/custom-screen.module';
import { InfoScreenModule } from './modules/info/info-screen.module';
import { InvitationModule } from './modules/invitation/invitation.module';
import { QuestionScreenModule } from './modules/questions/question-screen.module';
import { ScreenModule } from './modules/screen/screen.module';
import { UniqueScreenModule } from './modules/unique/unique-screen.module';
import { ConstructorConfigService } from './services/config/constructor-config.service';
import { CONSTRUCTOR_CONFIG_TOKEN } from './services/config/constructor.config.token';
import { ConstructorService } from './services/constructor/constructor.service';
import { MockService } from './services/mock/mock.service';
import { RestService } from './services/rest/rest.service';
import { UnsubscribeService } from './services/unsubscribe/unsubscribe.service';
import { SharedModule } from './shared-module/shared-components.module';
import { EmptyModule } from './modules/empty/empty.module';

const COMPONENTS = [
  ConstructorComponent
];

@NgModule({
  declarations: [
    ...COMPONENTS,
  ],
  imports: [
    CommonModule,

    ScreenModule,
    CustomScreenModule,
    QuestionScreenModule,
    UniqueScreenModule,
    InvitationModule,
    LayoutModule,
    EmptyModule,

    SharedModule,
    EpguLibModule.forChild(),
    InfoScreenModule,
  ],
  providers: [
    RestService,
    ConstructorService,
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
