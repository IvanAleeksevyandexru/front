import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { NextStepEventData, PrevStepEventData } from '../../../../interfaces/step-event-data.interface';

@Injectable()
export class NavigationService {
  clickToBack = new Subject();
  clickToBack$ = this.clickToBack.asObservable();

  nextStep = new Subject<NextStepEventData>();
  nextStep$ = this.nextStep.asObservable();

  prevStep = new Subject<PrevStepEventData>();
  prevStep$ = this.prevStep.asObservable();
}
