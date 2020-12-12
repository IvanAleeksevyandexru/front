import { NgModule } from '@angular/core';
import { PaymentComponent } from './payment.component';
import { SharedModule } from '../../../../../../shared/shared.module';
import { PaymentService } from '../../payment.service';
import { CoreModule } from '../../../../../../core/core.module';
import { BaseModule } from '../../../../../../shared/components/base/base.module';
import { ScreenContainerModule } from '../../../../../../shared/components/screen-container/screen-container.module';

@NgModule({
  declarations: [PaymentComponent],
  exports: [PaymentComponent],
  providers: [PaymentService],
  imports: [CoreModule, SharedModule, BaseModule, ScreenContainerModule],
})
export class PaymentModule {}
