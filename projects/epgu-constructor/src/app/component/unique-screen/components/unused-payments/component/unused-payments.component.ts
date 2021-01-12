import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DisplayDto } from '../../../../../form-player/services/form-player-api/form-player-api.types';
import { UnusedPaymentInterface } from '../unused-payment.interface';

@Component({
  selector: 'epgu-constructor-unused-payments',
  templateUrl: './unused-payments.component.html',
  styleUrls: ['./unused-payments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnusedPaymentsComponent {
  @Input() data: DisplayDto;
  @Input() paymentsData: UnusedPaymentInterface[] = [];
  @Input() showNav: boolean;

  @Output() next = new EventEmitter<null>();

  nextAction(): void {
    this.next.emit();
  }
}
