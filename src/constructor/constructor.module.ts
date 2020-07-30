import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EpguLibModule} from 'epgu-lib';
import {ConstructorComponent} from './constructor.component';
import {WelcomeBlockModule} from '../app/components/welcome-block/welcome-block.module';
import {QuestionBlockModule} from '../app/components/questions-block/question-block.module';
import {RequirementsListModule} from '../app/components/requirements-list/requirements-list.module';
import {ConfirmPersonalUserEmailScreenModule} from '../app/components/confirm-personal-user/screens/confirm-personal-user-email-screen/confirm-personal-user-email-screen.module';
import {SharedComponentsModule} from '../app/components/shared-components/shared-components.module';
import {ConstructorComponentRoutingModule} from './constructor-routing.module';
import {QuestionBlockModule} from './modules/questions-block/question-block.module';
import {RequirementsListModule} from './modules/requirements-list/requirements-list.module';
import {SharedModule} from '../shared/shared.module';
import {WelcomeBlockModule} from './modules/welcome-block/welcome-block.module';
import {ConfirmPersonalUserEmailScreenModule} from "./modules/confirm-personal-user/screens/confirm-personal-user-email-screen/confirm-personal-user-email-screen.module";
import {ConfirmPersonalUserPhoneScreenModule} from "./modules/confirm-personal-user/screens/confirm-personal-user-phone-screen/confirm-personal-user-phone-screen.module";
import {ConfirmPersonalUserPhoneScreenModule} from '../app/components/confirm-personal-user/screens/confirm-personal-user-phone-screen/confirm-personal-user-phone-screen.module';
import {ConfirmPersonalUserAddressScreenModule} from '../app/components/confirm-personal-user/screens/confirm-personal-user-address-screen/confirm-personal-user-address-screen.module';

const COMPONENTS = [
  ConstructorComponent
];

@NgModule({
  declarations: [
    ...COMPONENTS
  ],
  imports: [
    CommonModule,
    WelcomeBlockModule,
    QuestionBlockModule,
    RequirementsListModule,
    ConfirmPersonalUserEmailScreenModule,
    SharedComponentsModule,
    ConstructorComponentRoutingModule,
    ConfirmPersonalUserPhoneScreenModule,
    ConfirmPersonalUserAddressScreenModule,
    EpguLibModule.forChild(),
  ],
  providers: [],
  exports: [
    ...COMPONENTS
  ]
})

export class ConstructorModule { }
