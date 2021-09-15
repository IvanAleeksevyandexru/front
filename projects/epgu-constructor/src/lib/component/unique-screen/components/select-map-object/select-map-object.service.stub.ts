import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SelectMapObjectServiceStub {

  isMapLoaded = new BehaviorSubject(false);
}
