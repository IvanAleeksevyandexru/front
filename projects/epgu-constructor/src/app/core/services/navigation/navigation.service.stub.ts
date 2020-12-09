import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Navigation } from '../../../form-player/form-player.types';

@Injectable()
export class NavigationServiceStub {
  nextStep = new Subject<Navigation>();
  nextStep$ = this.nextStep.asObservable();
  prevStep = new Subject<Navigation>();
  prevStep$ = this.prevStep.asObservable();
  skipStep = new Subject<Navigation>();
  skipStep$ = this.skipStep.asObservable();

  redirectToLK(): void {}

  redirectToProfileEdit(): void {}

  redirectToHome(): void {}
}
