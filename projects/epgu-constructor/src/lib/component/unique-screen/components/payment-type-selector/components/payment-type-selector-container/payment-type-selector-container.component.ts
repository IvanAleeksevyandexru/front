import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ComponentBase } from '../../../../../../screen/screen.types';
import { ScreenService } from '../../../../../../screen/screen.service';
import { PaymentTypeSelectorContext } from '../../payment-type-selector.types';

@Component({
  selector: 'epgu-constructor-payment-type-selector-container',
  templateUrl: './payment-type-selector-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentTypeSelectorContainerComponent {
  data$ = this.screenService.component$;
  showNav$ = this.screenService.showNav$;
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

  constructor(private screenService: ScreenService) {}
}
