import { Component } from '@angular/core';
import { ConfigService } from '../../../../../../core/config/config.service';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { UnsubscribeService } from '../../../../../../core/services/unsubscribe/unsubscribe.service';
import { ScreenService } from '../../../../../../screen/screen.service';
import { PaymentService } from '../../payment.service';
import { AbstractPaymentComponent } from '../../abstractpayment.component';

@Component({
  selector: 'epgu-constructor-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  providers: [UnsubscribeService],
})
export class PaymentComponent extends AbstractPaymentComponent {
  constructor(
    public paymentService: PaymentService,
    public screenService: ScreenService,
    public currentAnswersService: CurrentAnswersService,
    public ngUnsubscribe$: UnsubscribeService,
    public config: ConfigService,
  ) {
    super(paymentService, screenService, currentAnswersService, ngUnsubscribe$, config);
  }
}
