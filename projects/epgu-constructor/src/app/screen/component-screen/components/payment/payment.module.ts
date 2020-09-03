import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpguLibModule } from 'epgu-lib';
import { PaymentComponent } from './payment.component';
import { SharedModule } from '../../../../shared/shared.module';
import { PaymentService } from '../../../../services/payment/payment.service';

@NgModule({
	declarations: [
	  PaymentComponent
  ],
	exports: [
	  PaymentComponent
  ],
  providers: [
    PaymentService
  ],
	imports: [
		CommonModule,
		SharedModule,
		EpguLibModule.forChild(),
	]
})
export class PaymentModule { }
