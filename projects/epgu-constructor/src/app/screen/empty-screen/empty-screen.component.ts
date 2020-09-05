import { Component } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { EMPTY_SCREEN_COMPONENT } from '../../shared/constants/global';
import { UnsubscribeService } from '../../services/unsubscribe/unsubscribe.service';
import { Screen, ScreenStore } from '../screen.types';
import { ScreenService } from '../screen.service';

@Component({
  selector: 'epgu-constructor-empty-screen',
  templateUrl: './empty-screen.component.html',
  providers: [UnsubscribeService],
})
export class EmptyScreenComponent implements Screen {
  emptyComponentName = EMPTY_SCREEN_COMPONENT;
  screenStore: ScreenStore;

  constructor(private screenService: ScreenService, private ngUnsubscribe$: UnsubscribeService) {
    this.screenService.screenData$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((screenData: ScreenStore) => {
        this.screenStore = screenData;
      });
  }

  get redirectLink() {
    const { applicantAnswers } = this.screenStore;
    // TODO: handle case if there is no pay1 answered data
    return applicantAnswers.pay1?.value;
  }

  nextStep(): void {}

  prevStep(): void {}
}
