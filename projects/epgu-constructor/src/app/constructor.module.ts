import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EpguLibModule} from 'epgu-lib';
import {ConstructorComponent} from './constructor.component';
import {ScreenModule} from './modules/screen/screen.module';
import {QuestionScreenModule} from './modules/questions/question-screen.module';
import {CustomScreenModule} from './modules/custom/custom-screen.module';
import {UniqueScreenModule} from './modules/unique/unique-screen.module';
import {InfoScreenModule} from './modules/info/info-screen.module';
import {InvitationModule} from './modules/invitation/invitation.module';
import {EpgucSharedModule} from './shared-module/shared-components.module';
import {ConstructorConfigInterface} from '../interfaces/constructor-config.interface';
import {CONSTRUCTOR_CONFIG_TOKEN} from './services/config/constructor.config';
import {ConstructorService} from './services/config/constructor.service';

const COMPONENTS = [
  ConstructorComponent
];

@NgModule({
  declarations: [
    ...COMPONENTS
  ],
  imports: [
    CommonModule,

    ScreenModule,
    CustomScreenModule,
    QuestionScreenModule,
    UniqueScreenModule,
    InvitationModule,

    EpgucSharedModule,
    EpguLibModule.forChild(),
    InfoScreenModule,
  ],
  providers: [
    ConstructorService
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
        ConstructorService
      ]
    };
  }
}
