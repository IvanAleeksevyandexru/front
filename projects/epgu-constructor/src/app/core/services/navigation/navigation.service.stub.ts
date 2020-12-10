import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Navigation } from '../../../form-player/form-player.types';

@Injectable()
export class NavigationServiceStub {
  private nextStep = new Subject<Navigation>();
  nextStep$ = this.nextStep.asObservable();
  private prevStep = new Subject<Navigation>();
  prevStep$ = this.prevStep.asObservable();
  private skipStep = new Subject<Navigation>();
  skipStep$ = this.skipStep.asObservable();

  next(): void {}

  prev(): void {}

  skip(): void {}

  redirectToLK(): void {}

  redirectToProfileEdit(): void {}

  redirectToHome(): void {}
}
