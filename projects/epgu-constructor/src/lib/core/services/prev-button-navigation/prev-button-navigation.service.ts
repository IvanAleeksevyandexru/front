import { Injectable } from '@angular/core';
import { PrevButtonNavigation } from '@epgu/epgu-constructor-types';

import { ScreenService } from '../../../screen/screen.service';
import { NavigationService } from '../navigation/navigation.service';

@Injectable()
export class PrevButtonNavigationService implements PrevButtonNavigation {
  constructor(
    private navService: NavigationService,
    private screenService: ScreenService
  ) {}

  prev(): void {
    const { firstScreen } = this.screenService.display;
    if (firstScreen) {
      this.navService.redirectToHome();
    } else {
      this.navService.prev();
    }
  }
}
