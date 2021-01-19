import { NgModule } from '@angular/core';

import { ComponentWrapperComponent } from './component-wrapper.component';
import { ActionModule } from '../../../shared/directives/action/action.module';
import { ScreenPadModule } from '../../../shared/components/screen-pad/screen-pad.module';
import { FieldListModule } from '../../../shared/components/field-list/field-list.module';
import { BaseModule } from '../../../shared/base.module';
import { AnswerButtonModule } from '../../../shared/components/answer-button/answer-button.module';
import { ScreenContainerModule } from '../../../shared/components/screen-container/screen-container.module';
import { BaseComponentsModule } from '../../../shared/components/base-components/base-components.module';

@NgModule({
  declarations: [ComponentWrapperComponent],
  exports: [ComponentWrapperComponent],
  imports: [
    BaseModule,
    BaseComponentsModule,
    ScreenContainerModule,
    AnswerButtonModule,
    FieldListModule,
    ScreenPadModule,
    ActionModule,
  ],
})
export class ComponentWrapperModule {}
