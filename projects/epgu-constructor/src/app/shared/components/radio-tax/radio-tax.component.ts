import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

import { UnusedPaymentInterface } from '../../../component/unique-screen/components/unused-payments/unused-payment.interface';

@Component({
  selector: 'epgu-constructor-radio-tax',
  templateUrl: './radio-tax.component.html',
  styleUrls: ['./radio-tax.component.scss'],
})
export class RadioTaxComponent implements OnInit {
  @Input() data: UnusedPaymentInterface[] = [];
  @Output() selected = new EventEmitter<UnusedPaymentInterface>();

  selectedItem: UnusedPaymentInterface;

  ngOnInit(): void {
    if (this.data.length > 0) {
      const [item] = this.data;
      this.selectedItem = item;
    }
  }
}
