import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Navigation } from '../../../form-player/form-player.types';

@Injectable()
export class NavigationModalService {
  private nextStep = new Subject<Navigation>();
  nextStep$ = this.nextStep.asObservable();

  private prevStep = new Subject<Navigation>();
  prevStep$ = this.prevStep.asObservable();

  next(navigation: Navigation): void {
    this.nextStep.next(navigation);
  }

  prev(navigation: Navigation): void {
    this.prevStep.next(navigation);
  }
}
