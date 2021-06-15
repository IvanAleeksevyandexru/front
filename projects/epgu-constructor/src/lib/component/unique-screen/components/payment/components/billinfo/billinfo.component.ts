import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { AbstractPaymentComponent } from '../../abstract-payment.component';

@Component({
  selector: 'epgu-constructor-bill-info',
  templateUrl: './billinfo.component.html',
  styleUrls: ['../payment/payment.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillInfoComponent extends AbstractPaymentComponent {
  constructor(public injector: Injector) {
    super(injector);
  }

  /**
   * Возвращает ссылку на скачивание квитанции
   */
  get getBillLink(): string {
    const urlPrefix = this.config.mocks?.includes('payment')
      ? `${this.config.mockUrl}/pay/v1/bill/get/pdf`
      : `${this.config.billsApiUrl}bill/get/pdf`;

    return `${urlPrefix}/?billIds=${this.billId}`;
  }
}
