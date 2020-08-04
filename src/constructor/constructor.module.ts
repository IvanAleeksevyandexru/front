import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EpguLibModule} from 'epgu-lib';
import {ConstructorComponent} from './constructor.component';
import {ConstructorComponentRoutingModule} from './constructor-routing.module';
import {ScreenModule} from '../app/modules/screen/screen.module';
import {QuestionScreenModule} from '../app/modules/questions/question-screen.module';
import {CustomScreenModule} from '../app/modules/custom/custom-screen.module';
import { SharedComponentsModule } from '../app/module-share/shared-components.module';
import { UniqueScreenModule } from '../app/modules/unique/unique-screen.module';

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

    SharedComponentsModule,
    EpguLibModule.forChild(),
  ],
  providers: [],
  exports: [
    ...COMPONENTS
  ]
})

export class ConstructorModule { }
