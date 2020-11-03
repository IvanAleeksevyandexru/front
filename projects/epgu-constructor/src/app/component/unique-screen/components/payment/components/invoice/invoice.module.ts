import { NgModule } from '@angular/core';
import { InvoiceComponent } from './invoice.component';
import { SharedModule } from '../../../../../../shared/shared.module';
import { CoreModule } from '../../../../../../core/core.module';
import { InvoiceService } from './invoice.service';
import { PaymentService } from '../../payment.service';

@NgModule({
	declarations: [
	  InvoiceComponent
  ],
	exports: [
	  InvoiceComponent
  ],
  providers: [
    InvoiceService,
    PaymentService,
  ],
	imports: [
		CoreModule,
		SharedModule,
	]
})
export class InvoiceModule { }
