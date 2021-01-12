import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { UnusedPaymentInterface } from '../../../component/unique-screen/components/unused-payments/unused-payment.interface';
import { EventBusService } from '../../../core/services/event-bus/event-bus.service';

@Component({
  selector: 'epgu-constructor-radio-tax',
  templateUrl: './radio-tax.component.html',
  styleUrls: ['./radio-tax.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioTaxComponent implements OnInit {
  @Input() data: UnusedPaymentInterface[] = [];
  selectedItem: UnusedPaymentInterface;
  constructor(private eventBusService: EventBusService) {}

  select(index: number): void {
    this.selectedItem = this.data[index];
    this.eventBusService.emit('radioTaxSelectedEvent', this.selectedItem);
  }

  ngOnInit(): void {
    if (this.data.length > 0) {
      const [item] = this.data;
      this.selectedItem = item;
      this.eventBusService.emit('radioTaxSelectedEvent', this.selectedItem);
    }
  }
}
