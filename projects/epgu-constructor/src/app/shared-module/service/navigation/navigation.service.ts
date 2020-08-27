import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export class NavigationService {
  clickToBack = new Subject();
  clickToBack$ = this.clickToBack.asObservable();

  constructor() { }
}
