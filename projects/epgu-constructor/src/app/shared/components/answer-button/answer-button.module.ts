import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnswerButtonComponent } from './answer-button.component';
import { LongButtonModule } from '../long-button/long-button.module';
import { CoreModule } from '../../../core/core.module';

@NgModule({
  declarations: [AnswerButtonComponent],
  imports: [CommonModule, LongButtonModule, CoreModule],
  exports: [AnswerButtonComponent],
})
export class AnswerButtonModule {}
