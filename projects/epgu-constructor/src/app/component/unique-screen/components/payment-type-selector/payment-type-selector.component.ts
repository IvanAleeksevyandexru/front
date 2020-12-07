import { Component } from '@angular/core';

import { ScreenService } from '../../../../screen/screen.service';
import { ComponentActionDto } from '../../../../form-player/services/form-player-api/form-player-api.types';
import { Clarifications } from '../../../../shared/services/terra-byte-api/terra-byte-api.types';
import { ConfigService } from '../../../../core/config/config.service';

interface PaymentTypeSelectorInterface {
  actions: Array<ComponentActionDto>;
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
  isErrorTemplate: boolean;
  success = 'SUCCESS';
  applicantType: string = this.screenService.component.attrs.applicantType;

  constructor(private screenService: ScreenService, public config: ConfigService) {
    this.paymentTypeSelector = this.screenService.component.attrs.states[
      this.screenService.component.attrs.state
    ];
    this.isErrorTemplate = this.screenService.component.attrs.state !== this.success;
  }

  showBtn(applicantType: string): boolean {
    if (this.applicantType === applicantType) {
      return true;
    }

    return !applicantType;
  }
}
