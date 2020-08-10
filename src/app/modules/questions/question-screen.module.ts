import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EpgucSharedModule} from '@epgu-constructor';
import {QuestionsScreenComponent} from './components/root/questions-screen.component';
import {AnswerChoiceComponent} from './components/answer-choice/answer-choice.component';

const COMPONENTS = [
  QuestionsScreenComponent,
  AnswerChoiceComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    CommonModule,
    EpgucSharedModule,
  ]
})
export class QuestionScreenModule { }

