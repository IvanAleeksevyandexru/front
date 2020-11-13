import { Component } from '@angular/core';

import { ScreenService } from '../../../../screen/screen.service';
import { ComponentDtoAction } from '../../../../form-player/services/form-player-api/form-player-api.types';
import { Clarifications } from '../../../../shared/services/terra-byte-api/terra-byte-api.types';
import { ConfigService } from '../../../../core/config/config.service';

interface PaymentTypeSelectorInterface {
  actions: Array<ComponentDtoAction>;
  applicantType: string;
  body: string;
  header: string;
  subHeader: string;
  clarifications: Clarifications;
  srcImg?: string;
}

@Component({
  selector: 'epgu-constructor-payment-type-selector',
  templateUrl: './payment-type-selector.component.html',
  styleUrls: ['./payment-type-selector.component.scss'],
})
export class PaymentTypeSelectorComponent {
  paymentTypeSelector: PaymentTypeSelectorInterface;

  constructor(private screenService: ScreenService, public config: ConfigService) {
    this.paymentTypeSelector = this.screenService.component.attrs.states[
      this.screenService.component.attrs.state
    ];
  }
}
