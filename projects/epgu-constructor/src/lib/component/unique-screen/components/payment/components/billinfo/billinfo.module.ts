import { NgModule } from '@angular/core';
import { BillInfoComponent } from './billinfo.component';
import { PaymentService } from '../../payment.service';
import { BaseComponentsModule } from '../../../../../../shared/components/base-components/base-components.module';
import { ScreenContainerModule } from '../../../../../../shared/components/screen-container/screen-container.module';
import { BaseModule } from '../../../../../../shared/base.module';

@NgModule({
  declarations: [BillInfoComponent],
  exports: [BillInfoComponent],
  providers: [PaymentService],
  imports: [BaseModule, BaseComponentsModule, ScreenContainerModule],
  entryComponents: [BillInfoComponent]
})
export class BillinfoModule {}