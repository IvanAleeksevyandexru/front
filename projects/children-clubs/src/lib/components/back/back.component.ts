import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppNavigationService } from '@epgu/epgu-constructor-ui-kit';

@Component({
  selector: 'children-clubs-back',
  templateUrl: './back.component.html',
  styleUrls: ['./back.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackComponent {
  constructor(private appNavigationService: AppNavigationService) {}
  clickGoBack(): void {
    this.appNavigationService.prev();
  }

  handleKeyEvent(event: KeyboardEvent): void {
    if (['Space', 'Enter'].includes(event.code)) {
      event.preventDefault();
      this.appNavigationService.prev();
    }
  }
}
