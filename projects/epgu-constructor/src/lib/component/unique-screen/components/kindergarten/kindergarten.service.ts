import { Injectable } from '@angular/core';
import { CHILDS_HOME_PROPERTIES, Icons, YandexMapService } from '@epgu/epgu-constructor-ui-kit';
import { BehaviorSubject, Observable } from 'rxjs';
import { KindergartenSearchPanelService } from '../select-map-object/components/search-panel-resolver/components/kindergarten-search-panel/kindergarten-search-panel.service';
import { SelectMapObjectService } from '../select-map-object/select-map-object.service';

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

  constructor(
    private selectMapObjectService: SelectMapObjectService,
    private yandexMapService: YandexMapService,
    private icons: Icons,
    private kindergartenSearchPanelService: KindergartenSearchPanelService,
  ) {}

  public setState(state: KindergartenStates): void {
    this.kindergartenState.next(state);
  }

  public handleKindergartenSelection(): void {
    const selected = this.selectMapObjectService.filteredDictionaryItems.filter(
      (item) => item.isSelected,
    );
    if (selected.length) {
      this.selectMapObjectService.selectedViewItems$.next(
        selected.map((item) => {
          return { ...item, expanded: false };
        }),
      );
      this.selectMapObjectService.isSelectedView.next(true);
      const processed = selected.map((item) => {
        return {
          center: item.center,
          obj: item,
        };
      });
      this.yandexMapService.placeObjectsOnMap(processed);
    } else {
      this.selectMapObjectService.resetSelectedView();
    }
    this.placeChildsHomeOnMap();
  }

  public placeChildsHomeOnMap(): void {
    const options = this.icons.childsHome;
    this.yandexMapService.addObjectsOnMap(
      this.yandexMapService.createPlacemark(
        this.kindergartenSearchPanelService.childHomeCoords,
        CHILDS_HOME_PROPERTIES,
        options,
      ),
    );
  }
}
