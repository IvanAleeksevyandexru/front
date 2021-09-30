import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { PREV_BUTTON_NAVIGATION, PrevButtonNavigation } from './prev-button.token';

@Component({
  selector: 'epgu-cf-ui-prev-button',
  templateUrl: './prev-button.component.html',
  styleUrls: ['./prev-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrevButtonComponent {
  public isLoading = false;

  constructor(@Inject(PREV_BUTTON_NAVIGATION) private prevButtonNavigation: PrevButtonNavigation) {}

  clickGoBack(): void {
    this.isLoading = true;
    this.prevButtonNavigation.prev();
  }

  handleKeyEvent(event: KeyboardEvent): void {
    if (['Space', 'Enter'].includes(event.code)) {
      event.preventDefault();
      this.clickGoBack();
    }
  }
}
