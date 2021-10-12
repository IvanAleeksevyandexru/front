import { NgModule } from '@angular/core';
import { BillInfoComponent } from './billinfo.component';
import { PaymentService } from '../../payment.service';
import { BaseComponentsModule } from '../../../../../../shared/components/base-components/base-components.module';
import { ScreenContainerModule } from '@epgu/epgu-constructor-ui-kit';
import { BaseModule } from '../../../../../../shared/base.module';
import { PriorPrefixModule } from '../../../../../../shared/pipes/prior-prefix/prior-prefix.module';

@NgModule({
  declarations: [BillInfoComponent],
  exports: [BillInfoComponent],
  providers: [PaymentService],
  imports: [BaseModule, BaseComponentsModule, PriorPrefixModule, ScreenContainerModule],
  entryComponents: [BillInfoComponent],
})
export class BillinfoModule {}
