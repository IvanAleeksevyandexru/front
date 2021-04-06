import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ScreenModalServiceStub {
  minContentHeightSubject = new BehaviorSubject<number>(0);
  minContentHeight$ = this.minContentHeightSubject.asObservable();

  isInternalScenarioFinishSub = new BehaviorSubject<boolean>(true);
  isInternalScenarioFinish$ = this.isInternalScenarioFinishSub.asObservable();

  navigate(): void {}
}
