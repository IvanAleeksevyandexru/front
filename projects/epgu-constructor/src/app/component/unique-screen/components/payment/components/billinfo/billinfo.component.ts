import { Component } from '@angular/core';
import { ConfigService } from '../../../../../../core/config/config.service';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { UnsubscribeService } from '../../../../../../core/services/unsubscribe/unsubscribe.service';
import { ScreenService } from '../../../../../../screen/screen.service';
import { PaymentService } from '../../payment.service';
import { PaymentComponent } from '../payment/payment.component';

@Component({
  selector: 'epgu-constructor-bill-info',
  templateUrl: './billinfo.component.html',
  styleUrls: ['../payment/payment.component.scss'],
  providers: [UnsubscribeService],
})
export class BillInfoComponent extends PaymentComponent {
  constructor(
    public paymentService: PaymentService,
    public screenService: ScreenService,
    public currentAnswersService: CurrentAnswersService,
    public ngUnsubscribe$: UnsubscribeService,
    public config: ConfigService,
  ) {
    super(paymentService, screenService, currentAnswersService, ngUnsubscribe$, config);
  }

  /**
   * Возвращает ссылку на скачивание квитанции
   */
  get getBillLink(): string {
    const urlPrefix = this.config.mocks.includes('payment')
      ? `${this.config.mockUrl}/pay/v1/bill/get/pdf`
      : `${this.config.billsApiUrl}bill/get/pdf`;

    return `${urlPrefix}/?billIds=${this.billId}`;
  }
}
