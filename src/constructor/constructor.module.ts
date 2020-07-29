import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WelcomeScreenComponent} from './components/welcome-screen/welcome-screen.component';
import {RequirementsListComponent} from './components/requirements-list/requirements-list.component';
import {EpguLibModule} from 'epgu-lib';
import {ConstructorComponent} from './constructor.component';
import {QuestionBlockModule} from "./modules/questions-block/question-block.module";
import {ConfirmPersonalUserEmailScreenModule} from "./modules/confirm-personal-user/screens/confirm-personal-user-email-screen/confirm-personal-user-email-screen.module";
import {ConfirmPersonalUserPhoneScreenModule} from "./modules/confirm-personal-user/screens/confirm-personal-user-phone-screen/confirm-personal-user-phone-screen.module";
import {QuestionBlockModule} from './modules/questions-block/question-block.module';
import {SharedModule} from '../shared/shared.module';
import {WelcomeBlockModule} from './modules/welcome-block/welcome-block.module';

const COMPONENTS = [
  WelcomeScreenComponent,
  RequirementsListComponent,
  ConstructorComponent
];

@NgModule({
  declarations: [
    ...COMPONENTS
  ],
  imports: [
    CommonModule,
    QuestionBlockModule,
    WelcomeBlockModule,
    SharedModule,
    ConfirmPersonalUserEmailScreenModule,
    ConfirmPersonalUserPhoneScreenModule,
    EpguLibModule.forChild(),
  ],
  providers: [],
  exports: [
    ...COMPONENTS
  ]
})

export class ConstructorModule { }
