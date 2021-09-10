import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export enum KindergartenStates {
  map = 'map',
  priority = 'priority',
}

@Injectable()
export class KindergartenService {
  public get state$(): Observable<KindergartenStates> {
    return this.kindergartenState.asObservable();
  }
  private kindergartenState = new BehaviorSubject<KindergartenStates>(KindergartenStates.map);

  public setState(state: KindergartenStates): void {
    this.kindergartenState.next(state);
  }
}
