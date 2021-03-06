import { NgModule } from '@angular/core';
import { ScreenContainerModule } from '@epgu/epgu-constructor-ui-kit';
import { PaymentComponent } from './payment.component';
import { PaymentService } from '../../payment.service';
import { BaseComponentsModule } from '../../../../../../shared/components/base-components/base-components.module';
import { BaseModule } from '../../../../../../shared/base.module';
import { PriorPrefixModule } from '../../../../../../shared/pipes/prior-prefix/prior-prefix.module';

@NgModule({
  declarations: [PaymentComponent],
  exports: [PaymentComponent],
  providers: [PaymentService],
  imports: [BaseModule, BaseComponentsModule, PriorPrefixModule, ScreenContainerModule],
})
export class PaymentModule {}
