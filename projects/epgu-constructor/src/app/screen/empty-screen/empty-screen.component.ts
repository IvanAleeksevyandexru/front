import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { EMPTY_SCREEN_COMPONENT } from '../../../constant/global';
import { UnsubscribeService } from '../../services/unsubscribe/unsubscribe.service';
import { FormPlayerService } from '../../form-player.service';
import { PaymentScenarioInterface } from '../../../interfaces/payment.interface';
import { ScreenService } from '../screen.service';
import { ScreenData } from '../../../interfaces/screen.interface';

@Component({
  selector: 'epgu-constructor-empty-screen',
  templateUrl: './empty-screen.component.html',
  providers: [UnsubscribeService],
})
export class EmptyScreenComponent implements OnInit {
  // <-- constant
  emptyComponentName = EMPTY_SCREEN_COMPONENT;
  screenData: ScreenData;

  constructor(
    private screenService: ScreenService,
    private ngUnsubscribe$: UnsubscribeService,
    private formPlayerService: FormPlayerService,
  ) {}

  get redirectLink() {
    const applicantAnswers: PaymentScenarioInterface = this.formPlayerService.responseStore
      .scenarioDto;
    return applicantAnswers.applicantAnswers.pay1.value;
  }

  ngOnInit(): void {
    this.screenService.screenData$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((screenData: ScreenData) => {
        this.screenData = screenData;
      });
  }
}
