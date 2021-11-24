import { Injectable } from '@angular/core';
import { EMPTY } from 'rxjs';
import { Navigation } from '@epgu/epgu-constructor-types';

@Injectable()
export class NavigationModalServiceStub {
  nextStep$ = EMPTY;

  prevStep$ = EMPTY;

  next(navigation: Navigation): void {}

  prev(navigation: Navigation): void {}
}
