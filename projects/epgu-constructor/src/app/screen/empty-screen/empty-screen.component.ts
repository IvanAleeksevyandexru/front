import { Component, Input } from '@angular/core';
import { EMPTY_SCREEN_COMPONENT } from '../../../constant/global';
import { DisplayInterface } from '../../../interfaces/epgu.service.interface';
import { UnsubscribeService } from '../../services/unsubscribe/unsubscribe.service';
import { PaymentScenarioInterface } from '../../../interfaces/payment.interface';
import { FormPlayerService } from '../../services/form-player/form-player.service';

@Component({
  selector: 'epgu-constructor-empty-screen',
  templateUrl: './empty-screen.component.html',
  providers: [UnsubscribeService],
})
export class EmptyScreenComponent {
  // <-- constant
  emptyComponentName = EMPTY_SCREEN_COMPONENT;

  constructor(private formPlayerService: FormPlayerService) {}

  @Input() data: DisplayInterface;

  get redirectLink() {
    const applicantAnswers: PaymentScenarioInterface = this.formPlayerService.responseStore
      .scenarioDto;
    return applicantAnswers.applicantAnswers.pay1.value;
  }
}
