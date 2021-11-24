import { Injectable } from '@angular/core';
import { PrevButtonNavigation } from '@epgu/epgu-constructor-ui-kit';

import { ScreenService } from '../../../screen/screen.service';
import { NavigationService } from '../navigation/navigation.service';
import { Navigation } from '@epgu/epgu-constructor-types';

@Injectable()
export class PrevButtonNavigationService implements PrevButtonNavigation {
  constructor(private navService: NavigationService, private screenService: ScreenService) {}

  prev(navigation?: Navigation): void {
    const { firstScreen } = this.screenService.display;
    if (firstScreen) {
      this.navService.redirectToHome();
    } else {
      this.navService.prev(navigation);
    }
  }
}
