import { NgModule } from '@angular/core';
import { BillInfoComponent } from './billinfo.component';
import { SharedModule } from '../../../../../../shared/shared.module';
import { CoreModule } from '../../../../../../core/core.module';
import { PaymentService } from '../../payment.service';
import { BaseModule } from '../../../../../../shared/components/base/base.module';
import { ScreenContainerModule } from '../../../../../../shared/components/screen-container/screen-container.module';

@NgModule({
  declarations: [BillInfoComponent],
  exports: [BillInfoComponent],
  providers: [PaymentService],
  imports: [CoreModule, SharedModule, BaseModule, ScreenContainerModule],
})
export class BillinfoModule {}
