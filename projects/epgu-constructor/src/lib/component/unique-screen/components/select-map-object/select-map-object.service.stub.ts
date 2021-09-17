import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SelectMapObjectServiceStub {

  isMapLoaded = new BehaviorSubject(false);
  public isSelectedView = new BehaviorSubject<boolean>(false);

  public placeChildsHomeOnMap(): void {
    return;
  }

  public resetSelectedView(): void {
    return;
  }

  public handleKindergartenSelection(): void {
    return;
  }

}
