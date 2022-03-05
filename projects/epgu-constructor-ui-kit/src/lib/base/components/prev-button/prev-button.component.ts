import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';
import { ScreenButton } from '@epgu/epgu-constructor-types';
import { PREV_BUTTON_NAVIGATION, PrevButtonNavigation } from './prev-button.token';
import { ObjectHelperService } from '../../../core/services/object-helper/object-helper.service';

@Component({
  selector: 'epgu-cf-ui-prev-button',
  templateUrl: './prev-button.component.html',
  styleUrls: ['./prev-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrevButtonComponent {
  @Input() hiddenPrevButton: ScreenButton;
  public isLoading = false;

  constructor(
    @Inject(PREV_BUTTON_NAVIGATION) private prevButtonNavigation: PrevButtonNavigation,
    private objectHelperService: ObjectHelperService,
  ) {}

  clickGoBack(): void {
    this.isLoading = true;
    if (this.hiddenPrevButton) {
      const params = this.objectHelperService.filterIncorrectObjectFields({
        stepsBack: this.hiddenPrevButton?.attrs?.stepsBack,
        screenId: this.hiddenPrevButton?.attrs?.screenId,
      });

      this.prevButtonNavigation.prev({
        options: {
          params,
        },
      });
    } else {
      this.prevButtonNavigation.prev();
    }
  }

  handleKeyEvent(event: KeyboardEvent): void {
    if (['Space', 'Enter'].includes(event.code)) {
      event.preventDefault();
      this.clickGoBack();
    }
  }
}
