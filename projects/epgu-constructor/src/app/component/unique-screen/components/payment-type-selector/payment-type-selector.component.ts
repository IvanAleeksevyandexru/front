import { Component, DoCheck, Input } from '@angular/core';
import { ConfigService } from '../../../../core/config/config.service';
import { ComponentActionDto } from '../../../../form-player/services/form-player-api/form-player-api.types';
import { ComponentBase } from '../../../../screen/screen.types';
import { Clarifications } from '../../../../shared/services/terra-byte-api/terra-byte-api.types';

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
export class PaymentTypeSelectorComponent implements DoCheck {
  @Input() data: ComponentBase;

  paymentTypeSelector: PaymentTypeSelectorInterface;
  isErrorTemplate: boolean;
  success = 'SUCCESS';
  applicantType: string;

  constructor(public config: ConfigService) {}

  ngDoCheck(): void {
    this.paymentTypeSelector = this.data.attrs.states[this.data.attrs.state];
    this.isErrorTemplate = this.data.attrs.state !== this.success;
    this.applicantType = this.data.attrs.applicantType;
  }

  showBtn(applicantType: string): boolean {
    if (this.applicantType === applicantType) {
      return true;
    }

    return !applicantType;
  }
}
