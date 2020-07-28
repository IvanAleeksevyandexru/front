import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../../shared/shared.module';
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
    SharedModule,
  ]
})
export class QuestionBlockModule { }

