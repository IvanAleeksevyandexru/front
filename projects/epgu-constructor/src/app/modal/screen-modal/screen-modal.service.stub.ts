import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ScreenModalServiceStub {
  minContentHeightSub$ = new BehaviorSubject<number>(0);
  minContentHeight$ = this.minContentHeightSub$.asObservable();

  isInternalScenarioFinishSub$ = new BehaviorSubject<boolean>(true);
  isInternalScenarioFinish$ = this.isInternalScenarioFinishSub$.asObservable();

  navigate(): void {}
}
