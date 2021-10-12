import { Injectable } from '@angular/core';
import { EMPTY } from 'rxjs';
import { Navigation } from '../../../form-player/form-player.types';

@Injectable()
export class NavigationModalServiceStub {
  nextStep$ = EMPTY;

  prevStep$ = EMPTY;

  next(navigation: Navigation): void {}

  prev(navigation: Navigation): void {}
}
