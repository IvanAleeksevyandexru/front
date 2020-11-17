import { Component } from '@angular/core';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';
import { ScreenService } from '../screen.service';
import { EmptyScreenComponentTypes } from '../../component/empty-screen/empty-screen-components.types';

@Component({
  selector: 'epgu-constructor-empty-screen',
  templateUrl: './empty-screen.component.html',
  providers: [UnsubscribeService],
})
export class EmptyScreenComponent {
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
}
