import { NgModule } from '@angular/core';
import { QuestionsScreenComponent } from './questions-screen.component';
import { BaseComponentsModule } from '../../shared/components/base-components/base-components.module';
import { ScreenContainerModule } from '@epgu/epgu-constructor-ui-kit';
import { AnswerButtonModule } from '../../shared/components/answer-button/answer-button.module';
import { BaseModule } from '../../shared/base.module';
import { ScreenButtonsModule } from '../../shared/components/screen-buttons/screen-buttons.module';

@NgModule({
  declarations: [QuestionsScreenComponent],
  exports: [QuestionsScreenComponent],
  imports: [
    BaseModule,
    BaseComponentsModule,
    ScreenContainerModule,
    AnswerButtonModule,
    ScreenButtonsModule,
  ],
})
export class QuestionsScreenModule {}
