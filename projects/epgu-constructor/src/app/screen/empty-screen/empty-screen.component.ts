import { Component } from '@angular/core';
import { UnsubscribeService } from '../../services/unsubscribe/unsubscribe.service';
import { Screen } from '../screen.types';
import { ScreenService } from '../screen.service';
import { EmptyScreenComponentTypes } from './empty-screen.types';

@Component({
  selector: 'epgu-constructor-empty-screen',
  templateUrl: './empty-screen.component.html',
  providers: [UnsubscribeService],
})
export class EmptyScreenComponent implements Screen {
  emptyComponentName = EmptyScreenComponentTypes;

  constructor(public screenService: ScreenService) {}

  get redirectLink() {
    const { applicantAnswers } = this.screenService;
    const ref = this.screenService.component?.attrs.ref;
    return applicantAnswers[ref]?.value;
  }

  nextStep(): void {}

  prevStep(): void {}
}
