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

const COMPONENTS = [
  ConstructorComponent,
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
    EpguLibModule.forChild(),
  ],
  providers: [],
  exports: [
    ...COMPONENTS
  ]
})

export class ConstructorModule { }
