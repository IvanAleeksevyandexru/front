import { NgModule } from '@angular/core';
import { PaymentTypeSelectorComponent } from './payment-type-selector.component';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { ScreenContainerModule } from '../../../../shared/components/screen-container/screen-container.module';
import { ScreenPadModule } from '../../../../shared/components/screen-pad/screen-pad.module';
import { AnswerButtonModule } from '../../../../shared/components/answer-button/answer-button.module';
import { ScreenService } from '../../../../screen/screen.service';
import { BaseModule } from '../../../../shared/base.module';

@NgModule({
  declarations: [PaymentTypeSelectorComponent],
  exports: [PaymentTypeSelectorComponent],
  providers: [ScreenService],
  imports: [
    BaseModule,
    BaseComponentsModule,
    ScreenContainerModule,
    ScreenPadModule,
    AnswerButtonModule,
  ],
})
export class PaymentTypeSelectorModule {}
