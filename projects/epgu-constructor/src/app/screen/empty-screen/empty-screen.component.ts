import { Component } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { EMPTY_SCREEN_COMPONENT } from '../../../constant/global';
import { UnsubscribeService } from '../../services/unsubscribe/unsubscribe.service';
import { ScreenService } from '../screen.service';
import { ScreenStore } from '../screen.types';

@Component({
  selector: 'epgu-constructor-empty-screen',
  templateUrl: './empty-screen.component.html',
  providers: [UnsubscribeService],
})
export class EmptyScreenComponent {
  // <-- constant
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
    const ref = this.screenStore.display?.components[0]?.attrs.ref;
    return applicantAnswers[ref]?.value;
  }
}
