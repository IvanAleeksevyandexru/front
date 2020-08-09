import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EpguLibModule} from 'epgu-lib';
import {ConstructorComponent} from './constructor.component';
import {ConstructorComponentRoutingModule} from './constructor-routing.module';
import {ScreenModule} from '../app/modules/screen/screen.module';
import {QuestionScreenModule} from '../app/modules/questions/question-screen.module';
import {CustomScreenModule} from '../app/modules/custom/custom-screen.module';
import {SharedComponentsModule} from '../app/module-share/shared-components.module';
import {UniqueScreenModule} from '../app/modules/unique/unique-screen.module';
import {InfoScreenModule} from '../app/modules/info/info-screen.module';
import {InvitationModule} from '../app/modules/invitation/invitation.module';
import {EpguConstructorModule} from '@epgu-constructor';

const COMPONENTS = [
  ConstructorComponent
];

@NgModule({
  declarations: [
    ...COMPONENTS
  ],
  imports: [
    CommonModule,
    ConstructorComponentRoutingModule,

    ScreenModule,
    CustomScreenModule,
    QuestionScreenModule,
    UniqueScreenModule,
    InvitationModule,

    EpguConstructorModule,

    SharedComponentsModule,
    EpguLibModule.forChild(),
    InfoScreenModule,
  ],
  providers: [],
  exports: [
    ...COMPONENTS
  ]
})

export class ConstructorModule {
}
