import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Navigation } from '../../../form-player/form-player.types';

@Injectable()
export class NavigationModalService {
  public get nextStep$(): Observable<Navigation> {
    return this.nextStep.asObservable();
  }

  public get prevStep$(): Observable<Navigation> {
    return this.prevStep.asObservable();
  }

  private nextStep = new Subject<Navigation>();
  private prevStep = new Subject<Navigation>();

  next(navigation: Navigation): void {
    this.nextStep.next(navigation);
  }

  prev(navigation: Navigation): void {
    this.prevStep.next(navigation);
  }
}
