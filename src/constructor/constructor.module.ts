import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EpguLibModule} from 'epgu-lib';
import {ConstructorComponent} from './constructor.component';
<<<<<<< HEAD
import {SharedComponentsModule} from '../app/components/shared-components/shared-components.module';
import {ConstructorComponentRoutingModule} from './constructor-routing.module';
import {QuestionBlockModule} from './modules/questions-block/question-block.module';
import {RequirementsListModule} from './modules/requirements-list/requirements-list.module';
import {ConfirmPersonalUserEmailScreenModule} from "./modules/confirm-personal-user/screens/confirm-personal-user-email-screen/confirm-personal-user-email-screen.module";
import {ConfirmPersonalUserPhoneScreenModule} from '../app/components/confirm-personal-user/screens/confirm-personal-user-phone-screen/confirm-personal-user-phone-screen.module';
import {ConfirmPersonalUserAddressScreenModule} from '../app/components/confirm-personal-user/screens/confirm-personal-user-address-screen/confirm-personal-user-address-screen.module';
import {ConfirmCreatedRequestScreenModule} from '../app/components/confirm-created-request-screen/confirm-created-request-screen.module';
import {WelcomeScreenModule} from '../app/components/welcome-screen/welcome-screen.module';
import { ConfirmPersonalUserDataScreenModule } from '../app/components/confirm-personal-user/screens/confirm-personal-user-data-screen/confirm-personal-user-data-screen.module';
import {ConfirmPersonalUserAddressScreenModule} from '../app/components/confirm-personal-user/screens/confirm-personal-user-address-screen/confirm-personal-user-address-screen.module';
=======
import {ConstructorComponentRoutingModule} from './constructor-routing.module';
import {ScreenModule} from '../app/modules/screen/screen.module';
import {QuestionBlockModule} from '../app/modules/questions/question-block.module';
import {CustomScreeModule} from '../app/modules/custom/custom-scree.module';
>>>>>>> ef358ca... [EPGU-267]

const COMPONENTS = [
  ConstructorComponent
];

@NgModule({
  declarations: [
    ...COMPONENTS
  ],
  imports: [
    CommonModule,
<<<<<<< HEAD
    WelcomeScreenModule,
    QuestionBlockModule,
    RequirementsListModule,
    ConfirmPersonalUserEmailScreenModule,
    SharedComponentsModule,
    ConstructorComponentRoutingModule,
    ConfirmPersonalUserPhoneScreenModule,
    ConfirmPersonalUserAddressScreenModule,
    ConfirmCreatedRequestScreenModule,
    ConfirmPersonalUserDataScreenModule,
=======
    ConstructorComponentRoutingModule,

    ScreenModule,
    CustomScreeModule,
    QuestionBlockModule,

>>>>>>> ef358ca... [EPGU-267]
    EpguLibModule.forChild(),
  ],
  providers: [],
  exports: [
    ...COMPONENTS
  ]
})

export class ConstructorModule { }
