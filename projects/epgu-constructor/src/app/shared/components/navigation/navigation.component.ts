import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NavigationService } from '../../../core/services/navigation/navigation.service';
import { ScreenService } from '../../../screen/screen.service';

@Component({
  selector: 'epgu-constructor-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent implements OnInit {
  constructor(private navService: NavigationService, private screenService: ScreenService) {}

  ngOnInit(): void {}

  clickGoBack(): void {
    const { firstScreen } = this.screenService.display;
    if (firstScreen) {
      this.navService.redirectToHome();
    } else {
      this.navService.prev();
    }
  }

  handleKeyEvent(event: KeyboardEvent): void {
    if (event.code === 'Space') {
      event.preventDefault();
      this.clickGoBack();
    }
  }
}
