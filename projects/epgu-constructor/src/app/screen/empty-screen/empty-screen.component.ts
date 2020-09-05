import { Component } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { UnsubscribeService } from '../../services/unsubscribe/unsubscribe.service';
import { Screen, ScreenStore } from '../screen.types';
import { ScreenService } from '../screen.service';
import { EmptyScreenComponents } from './empty-screen.types';

@Component({
  selector: 'epgu-constructor-empty-screen',
  templateUrl: './empty-screen.component.html',
  providers: [UnsubscribeService],
})
export class EmptyScreenComponent implements Screen {
  emptyComponentName = EmptyScreenComponents;
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
