import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpguLibModule } from 'epgu-lib';

import { PaymentTypeSelectorComponent } from './payment-type-selector.component';
import { CoreModule } from '../../../../core/core.module';
import { BaseModule } from '../../../../shared/components/base/base.module';
import { ScreenContainerModule } from '../../../../shared/components/screen-container/screen-container.module';
import { ScreenPadModule } from '../../../../shared/components/screen-pad/screen-pad.module';
import { AnswerButtonModule } from '../../../../shared/components/answer-button/answer-button.module';
import { ActionModule } from '../../../../shared/directives/action/action.module';

@NgModule({
  declarations: [PaymentTypeSelectorComponent],
  exports: [PaymentTypeSelectorComponent],
  imports: [
    CommonModule,
    EpguLibModule,
    CoreModule,
    BaseModule,
    ScreenContainerModule,
    ScreenPadModule,
    AnswerButtonModule,
    ActionModule,
  ],
})
export class PaymentTypeSelectorModule {}
