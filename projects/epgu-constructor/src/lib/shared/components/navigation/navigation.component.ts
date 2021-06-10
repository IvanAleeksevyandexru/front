import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavigationService } from '../../../core/services/navigation/navigation.service';
import { ScreenService } from '../../../screen/screen.service';

@Component({
  selector: 'epgu-constructor-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent {
  constructor(private navService: NavigationService, private screenService: ScreenService) {}

  clickGoBack(): void {
    const { firstScreen } = this.screenService.display;
    if (firstScreen) {
      this.navService.redirectToHome();
    } else {
      this.navService.prev();
    }
  }

  handleKeyEvent(event: KeyboardEvent): void {
    if (['Space', 'Enter'].includes(event.code)) {
      event.preventDefault();
      this.clickGoBack();
    }
  }
}
