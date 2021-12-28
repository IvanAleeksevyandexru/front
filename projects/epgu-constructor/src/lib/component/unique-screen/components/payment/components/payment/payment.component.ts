import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { AbstractPaymentComponent } from '../../abstract-payment.component';
const serverErrorIcon = require('!raw-loader!projects/epgu-constructor-ui-kit/src/assets/icons/svg/server-error.svg')
  .default as string;
const errorIcon = require('!raw-loader!projects/epgu-constructor-ui-kit/src/assets/icons/svg/error-icon.svg')
  .default as string;
@Component({
  selector: 'epgu-constructor-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentComponent extends AbstractPaymentComponent {
  public icons = { serverError: serverErrorIcon, error: errorIcon };

  constructor(public injector: Injector) {
    super(injector);
  }
}
