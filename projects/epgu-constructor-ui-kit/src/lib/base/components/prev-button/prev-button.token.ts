import { InjectionToken } from '@angular/core';
import { Navigation } from '@epgu/epgu-constructor-types';

export const PREV_BUTTON_NAVIGATION = new InjectionToken<string>('prevButtonNavigation');

export interface PrevButtonNavigation {
  prev: (navigation?: Navigation) => void;
}
