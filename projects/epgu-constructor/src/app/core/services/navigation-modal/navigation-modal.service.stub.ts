import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Navigation } from '../../../form-player/form-player.types';

@Injectable()
export class NavigationModalServiceStub {
  next(navigation: Navigation): void {}

  prev(navigation: Navigation): void {}
}
