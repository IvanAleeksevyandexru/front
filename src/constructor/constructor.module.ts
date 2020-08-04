import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EpguLibModule} from 'epgu-lib';
import {ConstructorComponent} from './constructor.component';
import {ConstructorComponentRoutingModule} from './constructor-routing.module';
import {ScreenModule} from '../app/modules/screen/screen.module';
import {QuestionScreenModule} from '../app/modules/questions/question-screen.module';
import {CustomScreeModule} from '../app/modules/custom/custom-scree.module';

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
    CustomScreeModule,
    QuestionScreenModule,

    EpguLibModule.forChild(),
  ],
  providers: [],
  exports: [
    ...COMPONENTS
  ]
})

export class ConstructorModule { }
