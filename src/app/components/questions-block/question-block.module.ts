import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedComponentsModule} from '../shared-components/shared-components.module';
import {QuestionsBlockComponent} from './questions-block.component';
import {AnswerChoiceComponent} from './components/answer-choice/answer-choice.component';

const COMPONENTS = [
  QuestionsBlockComponent,
  AnswerChoiceComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    CommonModule,
    SharedComponentsModule,
  ]
})
export class QuestionBlockModule { }

