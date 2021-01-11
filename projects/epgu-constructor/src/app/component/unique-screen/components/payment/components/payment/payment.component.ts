import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { UnsubscribeService } from '../../../../../../core/services/unsubscribe/unsubscribe.service';
import { AbstractPaymentComponent } from '../../abstractpayment.component';

@Component({
  selector: 'epgu-constructor-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentComponent extends AbstractPaymentComponent {
  constructor(public injector: Injector) {
    super(injector);
  }
}
