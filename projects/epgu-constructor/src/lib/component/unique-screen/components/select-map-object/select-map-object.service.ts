import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import {
  CHILDS_HOME_PROPERTIES,
  ConfigService,
  Icons,
  IFeatureCollection,
  IGeoCoords,
  IGeoCoordsResponse,
  KINDERGARTEN_SEARCH_RADIUS_IN_METERS,
  YandexMapService,
  YMapItem,
} from '@epgu/epgu-constructor-ui-kit';
import {
  DictionaryItem,
  DictionaryResponseError,
  DictionaryResponseForYMap,
  DictionaryYMapItem,
} from '../../../../shared/services/dictionary/dictionary-api.types';
import { filter } from 'rxjs/operators';
import {
  ComponentBaloonContentDto,
  ComponentDictionaryFilterDto,
} from '@epgu/epgu-constructor-types';
// eslint-disable-next-line max-len
import { IuikFullDataResponse } from './components/balloon-content-resolver/components/elections-balloon-content/elections-balloon-content.interface';
// eslint-disable-next-line max-len
import { KindergartenSearchPanelService } from './components/search-panel-resolver/components/kindergarten-search-panel/kindergarten-search-panel.service';
import { YaMapService } from '@epgu/ui/services/ya-map';

export interface SelectMapComponentAttrs {
  attributeNameWithAddress: string;
  baloonContent: ComponentBaloonContentDto[];
  dictionaryType: string;
  dictionaryFilter: ComponentDictionaryFilterDto[];
  electionDate?: string;
  electionLevel?: string;
  arePolygonsVisible?: boolean;
}

export interface IFillCoordsResponse extends IGeoCoordsResponse {
  dictionaryError?: DictionaryResponseError;
}

export enum MapTypes {
  commonMap = 'commonMap',
  electionsMap = 'electionsMap',
  kindergartenMap = 'kindergartenMap',
  justiceMap = 'justiceMap',
}

@Injectable()
export class SelectMapObjectService implements OnDestroy {
  public dictionary: DictionaryResponseForYMap;
  public filteredDictionaryItems: DictionaryYMapItem[] = [];
  public selectedValue = new Subject();
  public selectedViewItems$ = new BehaviorSubject<DictionaryItem[]>([]);
  public isNoDepartmentErrorVisible = new Subject<boolean>();
  public ymaps;
  public componentAttrs: SelectMapComponentAttrs; // Атрибуты компонента из getNextStep
  public mapEvents; // events от карт, устанавливаются при создание балуна
  public mapOpenedBalloonId: number;
  public mapType = MapTypes.commonMap;
  public isMapLoaded = new BehaviorSubject<boolean>(false);
  public isSelectedView = new BehaviorSubject<boolean>(false);
  private objectManager;
  private __mapStateCenter: number[];

  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private yaMapService: YaMapService,
    private icons: Icons,
    private yandexMapService: YandexMapService,
    private kindergartenSearchPanel: KindergartenSearchPanelService,
  ) {
    this.selectedValue.pipe(filter((value) => !value)).subscribe(() => {
      this.mapOpenedBalloonId = null;
    });
  }

  ngOnDestroy(): void {
    this.selectedValue.complete();
  }

  /**
   * Returns geo coords of physical addresses array
   * @param items
   */
  public getCoordsByAddress(items: DictionaryItem[]): Observable<IGeoCoordsResponse> {
    const path = `${this.config.externalApiUrl}/address/resolve`;
    if (items.length) {
      return this.http.post<IGeoCoordsResponse>(path, {
        address: items.map(
          (item) => item.attributeValues[this.componentAttrs.attributeNameWithAddress],
        ),
      });
    } else {
      return of({ coords: [], error: '' });
    }
  }

  /**
   * Fill map's objects in Dictionary with geo coords
   * @param dictionary
   * @param coords
   */
  public fillDictionaryItemsWithCoords(coords: IGeoCoordsResponse): void {
    const hashMap = {};
    coords.coords.forEach((coord) => {
      hashMap[coord.address] = { latitude: coord.latitude, longitude: coord.longitude };
    });
    this.dictionary.items.forEach((item, index) => {
      const coords = hashMap[
        item.attributeValues[this.componentAttrs.attributeNameWithAddress]
      ] as IGeoCoords;
      item.objectId = index;
      if (coords) {
        item.center = [coords.longitude, coords.latitude];
      }
      item.baloonContent =
        this.getMappedAttrsForBaloon(this.componentAttrs.baloonContent, item) || [];
    });
    this.filteredDictionaryItems = this.dictionary.items;
  }

  /**
   * prepares and returns collection of objects for yandex map
   * @param items geo objects
   */
  public prepareFeatureCollection(): IFeatureCollection<DictionaryItem> {
    const res = { type: 'FeatureCollection', features: [] };
    this.filteredDictionaryItems.forEach((item) => {
      if (item.center[0] && item.center[1]) {
        const obj = {
          type: 'Feature',
          id: item.idForMap,
          geometry: { type: 'Point', coordinates: item.center },
          properties: {
            res: { ...item, btnName: 'Выбрать', agreement: item.agreement },
          },
        };
        res.features.push(obj);
      }
    });
    return res;
  }

  /**
   * centers the map by coordinates
   * @param coords
   * @param object
   */
  public centeredPlaceMark(coords: number[], mapItem: YMapItem<DictionaryItem>): void {
    this.closeBalloon();
    let serviceContext = this;
    let offset = -0.00008;

    if (coords && coords[0] && coords[1]) {
      let center = this.yaMapService.map.getCenter();
      let equal = true;
      if (!serviceContext.__mapStateCenter) {
        serviceContext.__mapStateCenter = [];
      }
      if (serviceContext.__mapStateCenter[1] !== center[1]) {
        equal = false;
      }

      if (!equal || (equal && serviceContext.mapOpenedBalloonId !== mapItem.idForMap)) {
        this.yaMapService.map.zoomRange.get([coords[0], coords[1]]).then((range) => {
          serviceContext.yaMapService.map.setCenter([coords[0], coords[1] + offset], range[1] - 2);
          // Таймаут нужен что бы балун всегда нормально открывался
          // по непонятным причинам без таймаута балун иногда не открывается
          setTimeout(() => {
            serviceContext.objectManager &&
              serviceContext.objectManager.objects.setObjectOptions(mapItem.idForMap, {
                iconImageHref: serviceContext.icons.red.iconImageHref,
              });
            serviceContext.objectManager.objects.balloon.open(mapItem.idForMap);
            serviceContext.yaMapService.map.setCenter([coords[0], coords[1] + offset]);
            serviceContext.__mapStateCenter = serviceContext.yaMapService.map.getCenter();
          }, 200);
        });
      }
    }
    serviceContext.mapOpenedBalloonId = mapItem.idForMap;
    serviceContext.selectedValue.next(mapItem);
  }

  /**
   * filter geo items by searchString and redraw map
   * @param searchString
   */
  public searchMapObject(searchString: string): void {
    const searchStringLower = searchString.toLowerCase();
    this.filteredDictionaryItems = this.dictionary.items.filter((item) => {
      const address = (item.attributeValues[
        this.componentAttrs.attributeNameWithAddress
      ] as string)?.toLowerCase();
      return (
        item.title?.toLowerCase().includes(searchStringLower) ||
        address?.includes(searchStringLower)
      );
    });
    const items = this.convertDictionaryItemsToMapPoints(this.filteredDictionaryItems);
    this.yandexMapService.placeObjectsOnMap(items);
  }

  public findObjectByValue(value: string): DictionaryYMapItem {
    return this.filteredDictionaryItems.find((object) => object.value === value);
  }

  public centeredPlaceMarkByObjectValue(value: string): void {
    const valueFromDict = this.findObjectByValue(value);
    if (valueFromDict?.center) {
      this.centeredPlaceMark(valueFromDict.center, valueFromDict);
    }
  }

  /**
   * Заполняет словарь в сервисе полученными координатами
   * @param coords массив гео координат для объектов
   */
  public saveCoords(coords: IGeoCoordsResponse): void {
    this.fillDictionaryItemsWithCoords(coords);
    this.normalizeDictionaryForMap(this.dictionary);
  }

  public closeBalloon(): void {
    this.selectedValue.next(null);
    this.mapEvents?.fire('userclose');
  }

  public getElections(
    pollStationNumber: string,
    pollStationRegion: string,
    electionDate: string,
    electionLevel: string,
    options?,
  ): Observable<IuikFullDataResponse> {
    const path =
      `${this.config.lkuipElection}/api/map/uikFullData?pollStationNumber=` +
      pollStationNumber +
      '&pollStationRegion=' +
      pollStationRegion +
      '&electionDate=' +
      electionDate +
      '&electionLevel=' +
      electionLevel;
    return (this.http.get<IuikFullDataResponse>(path, {
      ...options,
      withCredentials: true,
    }) as unknown) as Observable<IuikFullDataResponse>;
  }

  public handleMultiSelectCentering(): void {
    let bounds: number[][];
    const { filteredDictionaryItems } = this;
    const selectedMapObjects = filteredDictionaryItems.filter((item) => item.isSelected);
    const { childHomeCoords } = this.kindergartenSearchPanel;
    if (selectedMapObjects.length) {
      const farthestKindergarten = this.findFarthestObject(childHomeCoords, selectedMapObjects);
      const reflectionPoint = this.getReflectionPoint(farthestKindergarten.center, childHomeCoords);
      bounds = this.yandexMapService.getBoundsByCoords([
        reflectionPoint,
        farthestKindergarten.center,
      ]);
    } else {
      const hasKindergartenNear = filteredDictionaryItems.some(
        (item) =>
          this.yandexMapService.getDistance(childHomeCoords, item.center) <
          KINDERGARTEN_SEARCH_RADIUS_IN_METERS,
      );
      if (hasKindergartenNear) {
        bounds = this.yandexMapService.getBoundsByCoords(this.getRadiusPoints(childHomeCoords));
      } else {
        const nearestKindergarten = this.findNearestObject(
          childHomeCoords,
          filteredDictionaryItems,
        );
        const reflectionPoint = this.getReflectionPoint(
          nearestKindergarten.center,
          childHomeCoords,
        );
        bounds = this.yandexMapService.getBoundsByCoords([
          nearestKindergarten.center,
          reflectionPoint,
        ]);
      }
    }
    this.yandexMapService.setBounds(bounds);
  }

  public findNearestObject(startPoint: number[], points: DictionaryYMapItem[]): DictionaryYMapItem {
    const distances = points.map((item) =>
      this.yandexMapService.getDistance(startPoint, item.center),
    );
    const minDistance = Math.min(...distances);
    const minDistanceIdx = distances.indexOf(minDistance);
    return points[minDistanceIdx];
  }

  // TODO: перенести все что относится к Kindergarten из select-map-object в kindergarten.service.ts
  public handleKindergartenSelection(): void {
    const selected = this.filteredDictionaryItems.filter((item) => item.isSelected);
    if (selected.length) {
      this.isSelectedView.next(true);
      this.selectedViewItems$.next(
        selected.map((item) => {
          return { ...item, expanded: false };
        }),
      );
      const processed = selected.map((item) => {
        return {
          center: item.center,
          obj: item,
        };
      });
      this.yandexMapService.placeObjectsOnMap(processed);
    } else {
      this.resetSelectedView();
    }
    this.placeChildsHomeOnMap();
  }

  public resetSelectedView(): void {
    this.isSelectedView.next(false);
    this.selectedViewItems$.next([]);
    this.yandexMapService.selectedValue$.next(null);
    this.yandexMapService.placeObjectsOnMap(
      this.convertDictionaryItemsToMapPoints(this.filteredDictionaryItems),
    );
  }

  public placeChildsHomeOnMap(): void {
    const options = this.icons.childsHome;
    this.yandexMapService.addObjectsOnMap(
      this.yandexMapService.createPlacemark(
        this.kindergartenSearchPanel.childHomeCoords,
        CHILDS_HOME_PROPERTIES,
        options,
      ),
    );
  }

  /**
   * Подготавливает массив с данными из справочника для отображения в балуне
   * @param attrs массив с атрибутами для отображения в балуне
   * @param item
   */
     public getMappedAttrsForBaloon(
      attrs: { name: string; label: string }[],
      item: DictionaryYMapItem,
    ): { value: string; label: string }[] {
      const res = [];
      attrs.forEach((attr) => {
        let itemValue = item.attributeValues[attr.name];
        if (itemValue) {
          res.push({
            value: itemValue,
            label: attr.label,
          });
        }
      });
      return res;
    }

  private convertDictionaryItemsToMapPoints(
    dictionaryItems: DictionaryYMapItem[],
  ): { obj: DictionaryYMapItem; center: [number, number] }[] {
    return dictionaryItems.map((item, idx) => {
      item.objectId = idx;
      return {
        center: item.center,
        obj: item,
      };
    });
  }

  private findFarthestObject(
    startPoint: number[],
    points: DictionaryYMapItem[],
  ): DictionaryYMapItem {
    const distances = points.map((item) =>
      this.yandexMapService.getDistance(startPoint, item.center),
    );
    const minDistance = Math.max(...distances);
    const minDistanceIdx = distances.indexOf(minDistance);
    return points[minDistanceIdx];
  }
  /**
   * Возвращает точку, симметричную параметру point, относительно параметра center
   * @param point точка
   * @param center центр симметрии
   */
  private getReflectionPoint(point: number[], center: number[]): number[] {
    const longitudeDifference = point[0] - center[0];
    const reflectionLongitude = center[0] - longitudeDifference;
    const latitudeDifference = point[1] - center[1];
    const reflectionLatitude = center[1] - latitudeDifference;
    return [reflectionLongitude, reflectionLatitude];
  }

  private getRadiusPoints(
    centerPoint: number[],
    distance = KINDERGARTEN_SEARCH_RADIUS_IN_METERS,
  ): number[][] {
    const azimuth45deg = Math.PI / 4;
    const rightTopDirection = [Math.sin(azimuth45deg), Math.cos(azimuth45deg)];
    const { endPoint: rightTopPoint } = this.yandexMapService.solveDirectProblem(
      centerPoint,
      rightTopDirection,
      distance,
    );
    const leftBottomPoint = this.getReflectionPoint(rightTopPoint, centerPoint);
    return [rightTopPoint, leftBottomPoint];
  }

  /**
   * Нормализует словарь под карту. Все точки с одинаковыми координатами сливает в одну заполняя массив children
   * @param dictionary - словарь для нормализации
   */
  private normalizeDictionaryForMap(dictionary: DictionaryResponseForYMap): void {
    const newItems = [];
    dictionary.items.forEach((item: DictionaryYMapItem) => {
      if (!item.center) {
        return;
      }
      // agreement - чекбокс согласия с условиями услуг для загсов
      const attrValues = item.attributeValues;
      item.agreement = attrValues.GET_CONSENT !== 'true';
      item.idForMap = item.objectId;
      newItems.push(item);
    });
    this.dictionary.items = newItems;
    this.filteredDictionaryItems = newItems;
  }
}
