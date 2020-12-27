import { NgModule } from '@angular/core';
import { AnswerButtonComponent } from './answer-button.component';
import { LongButtonModule } from '../long-button/long-button.module';
import { BaseModule } from '../../base.module';

@NgModule({
  declarations: [AnswerButtonComponent],
  imports: [BaseModule, LongButtonModule],
  exports: [AnswerButtonComponent],
})
export class AnswerButtonModule {}
