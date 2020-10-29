import { Component } from '@angular/core';
import { UnsubscribeService } from '../../shared/services/unsubscribe/unsubscribe.service';
import { Screen } from '../screen.types';
import { ScreenService } from '../screen.service';
import { EmptyScreenComponentTypes } from '../../component/empty-screen/empty-screen-components.types';

@Component({
  selector: 'epgu-constructor-empty-screen',
  templateUrl: './empty-screen.component.html',
  providers: [UnsubscribeService],
})
export class EmptyScreenComponent implements Screen {
  emptyComponentName = EmptyScreenComponentTypes;

  constructor(public screenService: ScreenService) {}

  /**
   * Возврат ссылки для редиректа
   */
  get redirectLink(): string {
    const { applicantAnswers } = this.screenService;
    const ref = this.screenService.component?.attrs?.ref;
    const linkFromRef = () => applicantAnswers[ref]?.value;
    const linkFromComponent = () => this.screenService.component?.attrs?.link;

    return ref ? linkFromRef() : linkFromComponent();
  }

  nextStep(): void {}

  prevStep(): void {}
}
