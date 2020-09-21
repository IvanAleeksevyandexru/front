import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpguLibModule } from 'epgu-lib';
import { QuestionsScreenComponent } from './questions-screen.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [QuestionsScreenComponent],
  exports: [QuestionsScreenComponent],
  imports: [
      CommonModule,
      SharedModule,
      EpguLibModule,
  ],
  providers: []
})
export class QuestionsScreenModule { }

