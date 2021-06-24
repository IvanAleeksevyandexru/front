import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ComponentDto } from '@epgu/epgu-constructor-types';
import { paymentsLabel, programsLabel } from '../../payment-way.const';
import {
  PaymentTypes,
  PaymentWay,
  PaymentWayComponentAttrsDto,
  PaymentWayInfo,
} from '../../payment-way.types';

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
  programsLabel = programsLabel;
  plural = ['рубль', 'рубля', 'рублей'];

  ngOnChanges(): void {
    if (this.component) {
      const { html, paymentWays } = <PaymentWayComponentAttrsDto>this.component.attrs;
      this.paymentWays = paymentWays.reduce(
        (acc, item) => ({
          ...acc,
          [item.paymentType]: { ...item, label: paymentsLabel[item.paymentType] },
        }),
        {} as Record<keyof typeof PaymentTypes, PaymentWay & { label: string }>,
      );
      this.paymentsInfo = html;
    }
  }
}
