import { NgModule } from '@angular/core';
import { BillInfoComponent } from './billinfo.component';
import { SharedModule } from '../../../../../../shared/shared.module';
import { CoreModule } from '../../../../../../core/core.module';
import { PaymentService } from '../../payment.service';

@NgModule({
	declarations: [
    BillInfoComponent
  ],
	exports: [
    BillInfoComponent
  ],
  providers: [
    PaymentService
  ],
	imports: [
		CoreModule,
		SharedModule,
	]
})
export class BillinfoModule { }
