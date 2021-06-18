import { Injectable } from '@angular/core';
import { PrevButtonNavigation } from '@epgu/epgu-constructor-types';

import { AppNavigationService } from '../app-navigation/app-navigation.service';

@Injectable()
export class AppPrevButtonNavigationService implements PrevButtonNavigation {
  constructor (private appNavigationService: AppNavigationService) {}

  public prev(): void {
    this.appNavigationService.prev();
  }
}
