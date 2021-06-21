import { NgModule } from '@angular/core';

import { DefaultUniqueScreenWrapperComponent } from './default-unique-screen-wrapper.component';
import { ActionModule } from '../../../../shared/directives/action/action.module';
import { ScreenPadModule } from '@epgu/epgu-constructor-ui-kit';
import { FieldListModule } from '../../../../shared/components/field-list/field-list.module';
import { BaseModule } from '../../../../shared/base.module';
import { AnswerButtonModule } from '../../../../shared/components/answer-button/answer-button.module';
import { ScreenContainerModule } from '@epgu/epgu-constructor-ui-kit';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { UserInfoLoaderModule } from '../../../../shared/components/user-info-loader/user-info-loader.module';
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
    UserInfoLoaderModule,
    ScreenButtonsModule
  ],
})
export class DefaultUniqueScreenWrapperModule {}
