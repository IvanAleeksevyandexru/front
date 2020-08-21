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
import {CONSTRUCTOR_CONFIG_TOKEN} from './services/config/constructor.config.token';
import {ConstructorService} from './services/constructor/constructor.service';
import {LayoutModule} from './layout/layout.module';
import {ConstructorConfigService} from './services/config/constructor-config.service';
import {RestService} from './services/rest/rest.service';
import {BookingScreenModule} from './modules/booking/booking-screen.module';

const COMPONENTS = [
  ConstructorComponent
];

@NgModule({
  declarations: [
    ...COMPONENTS
  ],
  imports: [
    CommonModule,
    BookingScreenModule,
    ScreenModule,
    CustomScreenModule,
    QuestionScreenModule,
    UniqueScreenModule,
    InvitationModule,
    LayoutModule,
    EpgucSharedModule,
    EpguLibModule.forChild(),
    InfoScreenModule,
  ],
  providers: [
    RestService,
    ConstructorService,
    ConstructorConfigService
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
