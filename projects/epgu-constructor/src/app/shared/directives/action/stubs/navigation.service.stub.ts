import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Navigation } from '../../../../form-player/form-player.types';

@Injectable()
export class NavigationServiceStub {
  nextStep = new Subject<Navigation>();
  prevStep = new Subject<Navigation>();
  skipStep = new Subject<Navigation>();

  redirectToLK(): void {}

  redirectToProfileEdit(): void {}

  redirectToHome(): void {}
}
