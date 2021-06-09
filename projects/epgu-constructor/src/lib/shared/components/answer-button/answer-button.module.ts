import { NgModule } from '@angular/core';
import { AnswerButtonComponent } from './answer-button.component';
import { BaseModule } from '../../base.module';

@NgModule({
  declarations: [AnswerButtonComponent],
  imports: [BaseModule],
  exports: [AnswerButtonComponent],
})
export class AnswerButtonModule {}
