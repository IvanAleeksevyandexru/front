import { Component } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { EMPTY_SCREEN_COMPONENT } from '../../../constant/global';
import { UnsubscribeService } from '../../services/unsubscribe/unsubscribe.service';
import { PaymentScenarioInterface } from '../../../interfaces/payment.interface';
import { Screen, ScreenData } from '../screen.types';
import { ScreenService } from '../screen.service';

@Component({
  selector: 'epgu-constructor-empty-screen',
  templateUrl: './empty-screen.component.html',
  providers: [UnsubscribeService],
})
export class EmptyScreenComponent implements Screen {
  emptyComponentName = EMPTY_SCREEN_COMPONENT;
  screenData: ScreenData;

  constructor(private screenService: ScreenService, private ngUnsubscribe$: UnsubscribeService) {
    this.screenService.screenData$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((screenData: ScreenData) => {
        this.screenData = screenData;
      });
  }

  get redirectLink() {
    const applicantAnswers: PaymentScenarioInterface = this.screenData
      .applicantAnswers as PaymentScenarioInterface;
    return applicantAnswers.applicantAnswers.pay1.value;
  }

  nextStep(): void {}

  prevStep(): void {}
}
