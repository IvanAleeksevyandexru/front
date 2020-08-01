import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedComponentsModule} from '../../module-share/shared-components.module';
import {QuestionsScreenComponent} from './components/root/questions-screen.component';
import {AnswerChoiceComponent} from './components/answer-choice/answer-choice.component';

const COMPONENTS = [
  QuestionsScreenComponent
];

@NgModule({
  declarations: [...COMPONENTS, AnswerChoiceComponent],
  exports: [...COMPONENTS],
  imports: [
    CommonModule,
    SharedComponentsModule,
  ]
})
export class QuestionScreenModule { }

