import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SelectMapObjectServiceStub {
  isMapLoaded = new BehaviorSubject(false);

  public isSelectedView = new BehaviorSubject<boolean>(false);

  public placeChildsHomeOnMap(): void {}

  public resetSelectedView(): void {}

  public handleKindergartenSelection(): void {}

  public searchMapObject(str: string): void {}
}
