import { InjectionToken } from '@angular/core';

export const PREV_BUTTON_NAVIGATION = new InjectionToken<string>('prevButtonNavigation');

export interface PrevButtonNavigation {
  prev: () => void;
}
