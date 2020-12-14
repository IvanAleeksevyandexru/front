import { NgModule } from '@angular/core';
import { PaymentComponent } from './payment.component';
import { PaymentService } from '../../payment.service';
import { CoreModule } from '../../../../../../core/core.module';
import { BaseModule } from '../../../../../../shared/components/base/base.module';
import { ScreenContainerModule } from '../../../../../../shared/components/screen-container/screen-container.module';

@NgModule({
  declarations: [PaymentComponent],
  exports: [PaymentComponent],
  providers: [PaymentService],
  imports: [CoreModule, BaseModule, ScreenContainerModule],
})
export class PaymentModule {}
