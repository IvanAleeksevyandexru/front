import { NgModule } from '@angular/core';

import { UnusedPaymentsContainerComponent } from './container/unused-payments-container.component';
import { UnusedPaymentsComponent } from './component/unused-payments.component';
import { RadioTaxModule } from '../../../../shared/components/radio-tax/radio-tax.module';
import { BaseModule } from '../../../../shared/base.module';
import { DefaultUniqueScreenWrapperModule } from '../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';

@NgModule({
  declarations: [UnusedPaymentsContainerComponent, UnusedPaymentsComponent],
  exports: [UnusedPaymentsContainerComponent],
  imports: [BaseModule, RadioTaxModule, DefaultUniqueScreenWrapperModule],
  entryComponents: [UnusedPaymentsContainerComponent],
})
export class UnusedPaymentsModule {}
