import { Injectable } from '@angular/core';

import { MicroAppNavigationService } from '../micro-app-navigation/micro-app-navigation.service';
import { PrevButtonNavigation } from '../../base/components/prev-button/prev-button.token';

@Injectable()
export class MicroAppPrevButtonNavigationService implements PrevButtonNavigation {
  constructor (private appNavigationService: MicroAppNavigationService) {}

  public prev(): void {
    this.appNavigationService.prev();
  }
}
