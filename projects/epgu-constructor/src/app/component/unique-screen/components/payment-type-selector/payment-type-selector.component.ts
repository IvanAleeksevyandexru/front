import { Component } from '@angular/core';

import { ScreenService } from '../../../../screen/screen.service';
import { ComponentDtoAction } from '../../../../form-player/services/form-player-api/form-player-api.types';
import { Clarifications } from '../../../../shared/services/terra-byte-api/terra-byte-api.types';

interface PaymentTypeSelectorInterface {
  actions: Array<ComponentDtoAction>;
  applicantType: string;
  label: string;
  header: string;
  clarifications: Clarifications;
}

@Component({
  selector: 'epgu-constructor-payment-type-selector',
  templateUrl: './payment-type-selector.component.html',
  styleUrls: ['./payment-type-selector.component.scss'],
})
export class PaymentTypeSelectorComponent {
  paymentTypeSelector: PaymentTypeSelectorInterface;

  constructor(private screenService: ScreenService) {
    this.paymentTypeSelector = this.screenService.component.attrs.states[
      this.screenService.component.attrs.state
    ];
  }
}
