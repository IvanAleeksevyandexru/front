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

  next(navigation?: Navigation): void {
    this.nextStep.next(navigation);
  }

  prev(navigation?: Navigation): void {
    this.prevStep.next(navigation);
  }

  skip(navigation?: Navigation): void {
    this.skipStep.next(navigation);
  }

  redirectToLK(): void {}

  redirectToProfileEdit(): void {}

  redirectToHome(): void {}
}
