import { NgModule } from '@angular/core';
import { PaymentComponent } from './payment.component';
import { PaymentService } from '../../payment.service';
import { BaseComponentsModule } from '../../../../../../shared/components/base-components/base-components.module';
import { ScreenContainerModule } from '../../../../../../shared/components/screen-container/screen-container.module';
import { BaseModule } from '../../../../../../shared/base.module';

@NgModule({
  declarations: [PaymentComponent],
  exports: [PaymentComponent],
  providers: [PaymentService],
  imports: [BaseModule, BaseComponentsModule, ScreenContainerModule],
  entryComponents: [PaymentComponent],
})
export class PaymentModule {}
