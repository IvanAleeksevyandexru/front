import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigService } from '../../../../core/services/config/config.service';
import { ComponentActionDto } from '../../../../form-player/services/form-player-api/form-player-api.types';
import { ComponentBase } from '../../../../screen/screen.types';
import { Clarifications } from '../../services/terra-byte-api/terra-byte-api.types';
import { ScreenService } from '../../../../screen/screen.service';

interface PaymentTypeSelectorInterface {
  actions: Array<ComponentActionDto>;
  body: string;
  header: string;
  subHeader: string;
  clarifications: Clarifications;
  srcImg?: string;
}

interface PaymentTypeSelectorContext {
  paymentTypeSelector: PaymentTypeSelectorInterface;
  isErrorTemplate: boolean;
  applicantType: string;
}

@Component({
  selector: 'epgu-constructor-payment-type-selector',
  templateUrl: './payment-type-selector.component.html',
  styleUrls: ['./payment-type-selector.component.scss'],
})
export class PaymentTypeSelectorComponent {
  data$ = this.screenService.component$;

  init$: Observable<PaymentTypeSelectorContext> = this.data$.pipe(
    map((data: ComponentBase) => {
      return {
        paymentTypeSelector: data.attrs.states[data.attrs.state],
        isErrorTemplate: data.attrs.state !== this.success,
        applicantType: data.attrs.applicantType,
      };
    }),
  );

  success = 'SUCCESS';

  constructor(public config: ConfigService, public screenService: ScreenService) {}

  showBtn(applicantType: string, action: ComponentActionDto): boolean {
    if (applicantType === action.applicantType) {
      return true;
    }

    return !action.applicantType;
  }
}
