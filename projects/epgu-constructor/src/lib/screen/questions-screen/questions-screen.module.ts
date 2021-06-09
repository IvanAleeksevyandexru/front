import { NgModule } from '@angular/core';
import { QuestionsScreenComponent } from './questions-screen.component';
import { BaseComponentsModule } from '../../shared/components/base-components/base-components.module';
import { ScreenContainerModule } from '../../shared/components/screen-container/screen-container.module';
import { AnswerButtonModule } from '../../shared/components/answer-button/answer-button.module';
import { BaseModule } from '../../shared/base.module';
import { UserInfoLoaderModule } from '../../shared/components/user-info-loader/user-info-loader.module';
import { ScreenButtonsModule } from '../../shared/components/screen-buttons/screen-buttons.module';

@NgModule({
  declarations: [QuestionsScreenComponent],
  exports: [QuestionsScreenComponent],
  imports: [
    BaseModule,
    BaseComponentsModule,
    ScreenContainerModule,
    AnswerButtonModule,
    UserInfoLoaderModule,
    ScreenButtonsModule,
  ],
})
export class QuestionsScreenModule {}
