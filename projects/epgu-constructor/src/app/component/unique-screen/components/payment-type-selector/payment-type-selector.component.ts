import { Component, OnInit } from '@angular/core';

import { ScreenService } from '../../../../screen/screen.service';
import { ComponentDtoAction } from '../../../../form-player/services/form-player-api/form-player-api.types';

@Component({
  selector: 'epgu-constructor-payment-type-selector',
  templateUrl: './payment-type-selector.component.html',
  styleUrls: ['./payment-type-selector.component.scss'],
})
export class PaymentTypeSelectorComponent implements OnInit {
  paymentTypeSelector: PaymentTypeSelectorInterface;

  constructor(private screenService: ScreenService) {
    this.paymentTypeSelector = this.screenService.component.attrs.states[
      this.screenService.component.attrs.state
    ];
  }

  ngOnInit(): void {
    console.log('test');
  }
}

interface PaymentTypeSelectorInterface {
  actions: Array<ComponentDtoAction>;
  label: string;
  header: string;
  clarifications: { [key: string]: any };
}
