import { NgModule } from '@angular/core';
import { QuestionsScreenComponent } from './questions-screen.component';
import { SharedModule } from '../../shared/shared.module';
import { CoreModule } from '../../core/core.module';

@NgModule({
  declarations: [QuestionsScreenComponent],
  exports: [QuestionsScreenComponent],
  imports: [
      CoreModule,
      SharedModule,
  ],
  providers: []
})
export class QuestionsScreenModule { }

