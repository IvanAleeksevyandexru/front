import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionsScreenComponent } from './components/root/questions-screen.component';
import { AnswerChoiceComponent } from './components/answer-choice/answer-choice.component';
import { SharedModule } from '../../shared-module/shared-components.module';
import { EpguLibModule } from 'epgu-lib';

const COMPONENTS = [
  QuestionsScreenComponent,
  AnswerChoiceComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
    imports: [
        CommonModule,
        SharedModule,
        EpguLibModule,
    ]
})
export class QuestionScreenModule { }

