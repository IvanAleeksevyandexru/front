import { NgModule } from '@angular/core';
import { PaymentComponent } from './payment.component';
import { SharedModule } from '../../../../../../shared/shared.module';
import { PaymentService } from '../../payment.service';
import { CoreModule } from '../../../../../../core/core.module';

@NgModule({
	declarations: [
	  PaymentComponent,
  ],
	exports: [
	  PaymentComponent,
  ],
  providers: [
    PaymentService,
  ],
	imports: [
		CoreModule,
		SharedModule,
	]
})
export class PaymentModule { }
