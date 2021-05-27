import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ComponentDto } from '@epgu/epgu-constructor-types';
import {
  PaymentTypes,
  PaymentWay,
  PaymentWayComponentAttrsDto,
  PaymentWayInfo,
} from '../../payment-way.types';
import { paymentWaysLabel } from '../../payment-way.const';

@Component({
  selector: 'epgu-constructor-payment-way',
  templateUrl: './payment-way.component.html',
  styleUrls: ['./payment-way.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentWayComponent implements OnChanges {
  @Input() component: ComponentDto;
  @Input() paymentControl: FormControl;
  paymentWays: Record<keyof typeof PaymentTypes, PaymentWay & { label: string }>;
  paymentsInfo: PaymentWayInfo;
  PaymentTypes = PaymentTypes;

  ngOnChanges(): void {
    if (this.component) {
      const { paymentInfo = null, paymentWay } = <PaymentWayComponentAttrsDto>this.component.attrs;
      this.paymentWays = paymentWay.reduce(
        (acc, item) => ({
          ...acc,
          [item.paymentType]: { ...item, label: paymentWaysLabel[item.paymentType] },
        }),
        {} as Record<keyof typeof PaymentTypes, PaymentWay & { label: string }>,
      );
      this.paymentsInfo = paymentInfo;
    }
  }
}
