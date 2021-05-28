import { NgModule } from '@angular/core';
// eslint-disable-next-line max-len
import { PaymentTypeSelectorContainerComponent } from './components/payment-type-selector-container/payment-type-selector-container.component';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { ScreenContainerModule } from '../../../../shared/components/screen-container/screen-container.module';
import { ScreenPadModule } from '@epgu/epgu-constructor-ui-kit';
import { AnswerButtonModule } from '../../../../shared/components/answer-button/answer-button.module';
import { ScreenService } from '../../../../screen/screen.service';
import { BaseModule } from '../../../../shared/base.module';
import { PaymentTypeSelectorComponent } from './components/payment-type-selector/payment-type-selector.component';
import { PaymentTypeSelectorButtonComponent } from './components/payment-type-selector-button/payment-type-selector-button.component';

@NgModule({
  declarations: [
    PaymentTypeSelectorContainerComponent,
    PaymentTypeSelectorComponent,
    PaymentTypeSelectorButtonComponent,
  ],
  exports: [PaymentTypeSelectorContainerComponent],
  providers: [ScreenService],
  imports: [
    BaseModule,
    BaseComponentsModule,
    ScreenContainerModule,
    ScreenPadModule,
    AnswerButtonModule,
  ],
  entryComponents: [PaymentTypeSelectorContainerComponent]
})
export class PaymentTypeSelectorModule {}
