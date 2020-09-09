import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { NavigationPayload } from '../../../form-player.types';

@Injectable()
export class NavigationService {
  clickToBack = new Subject();
  clickToBack$ = this.clickToBack.asObservable();

  nextStep = new Subject<NavigationPayload>();
  nextStep$ = this.nextStep.asObservable();

  prevStep = new Subject<NavigationPayload>();
  prevStep$ = this.prevStep.asObservable();
}
