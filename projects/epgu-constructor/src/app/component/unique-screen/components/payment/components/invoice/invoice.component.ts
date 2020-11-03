import { Component } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { ConfigService } from '../../../../../../core/config/config.service';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { UnsubscribeService } from '../../../../../../core/services/unsubscribe/unsubscribe.service';
import { ScreenService } from '../../../../../../screen/screen.service';
import { PaymentService } from '../../payment.service';
import { InvoiceService } from './invoice.service';
import { PaymentComponent } from '../payment/payment.component';

@Component({
  selector: 'epgu-constructor-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['../payment/payment.component.scss'],
  providers: [UnsubscribeService],
})
export class InvoiceComponent extends PaymentComponent {
  constructor(
    public paymentService: PaymentService,
    public screenService: ScreenService,
    public currentAnswersService: CurrentAnswersService,
    public ngUnsubscribe$: UnsubscribeService,
    public invoiceService: InvoiceService,
    public config: ConfigService,
  ) {
    super(paymentService, screenService, currentAnswersService, ngUnsubscribe$, config);
  }

  /**
   * Запрос на скачивание квитанции
   */
  downloadInvoice() {
    this.invoiceService
      .getInvoice(this.billId)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((invoice) => this.downloadInvoiceSuccess(invoice));
  }

  private downloadInvoiceSuccess(invoice) {
    console.log('invoice', invoice);
  }
}
