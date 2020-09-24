import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Navigation } from '../../../form-player.types';

@Injectable()
export class NavigationService {
  clickToBack = new Subject();
  clickToBack$ = this.clickToBack.asObservable();

  nextStep = new Subject<Navigation>();
  nextStep$ = this.nextStep.asObservable();

  prevStep = new Subject<Navigation>();
  prevStep$ = this.prevStep.asObservable();
}
