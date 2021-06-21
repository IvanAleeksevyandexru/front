import { Injectable } from '@angular/core';

import { AppNavigationService } from '../app-navigation/app-navigation.service';
import { PrevButtonNavigation } from '../../base/components/prev-button/prev-button';

@Injectable()
export class AppPrevButtonNavigationService implements PrevButtonNavigation {
  constructor (private appNavigationService: AppNavigationService) {}

  public prev(): void {
    this.appNavigationService.prev();
  }
}
