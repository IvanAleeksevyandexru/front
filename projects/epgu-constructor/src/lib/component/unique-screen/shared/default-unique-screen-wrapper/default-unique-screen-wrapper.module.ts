import { NgModule } from '@angular/core';

import { ScreenPadModule, ScreenContainerModule } from '@epgu/epgu-constructor-ui-kit';
import { DefaultUniqueScreenWrapperComponent } from './default-unique-screen-wrapper.component';
import { ActionModule } from '../../../../shared/directives/action/action.module';
import { FieldListModule } from '../../../../shared/components/field-list/field-list.module';
import { BaseModule } from '../../../../shared/base.module';
import { AnswerButtonModule } from '../../../../shared/components/answer-button/answer-button.module';

import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { ScreenButtonsModule } from '../../../../shared/components/screen-buttons/screen-buttons.module';

@NgModule({
  declarations: [DefaultUniqueScreenWrapperComponent],
  exports: [DefaultUniqueScreenWrapperComponent],
  imports: [
    BaseModule,
    BaseComponentsModule,
    ScreenContainerModule,
    AnswerButtonModule,
    FieldListModule,
    ScreenPadModule,
    ActionModule,
    ScreenButtonsModule,
  ],
})
export class DefaultUniqueScreenWrapperModule {}
