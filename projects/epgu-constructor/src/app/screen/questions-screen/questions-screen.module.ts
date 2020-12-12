import { NgModule } from '@angular/core';
import { QuestionsScreenComponent } from './questions-screen.component';
import { SharedModule } from '../../shared/shared.module';
import { CoreModule } from '../../core/core.module';
import { BaseModule } from '../../shared/components/base/base.module';
import { ScreenContainerModule } from '../../shared/components/screen-container/screen-container.module';
import { AnswerButtonModule } from '../../shared/components/answer-button/answer-button.module';
import { ActionModule } from '../../shared/directives/action/action.module';

@NgModule({
  declarations: [QuestionsScreenComponent],
  exports: [QuestionsScreenComponent],
  imports: [
    CoreModule,
    SharedModule,
    BaseModule,
    ScreenContainerModule,
    AnswerButtonModule,
    ActionModule,
  ],
  providers: [],
})
export class QuestionsScreenModule {}
