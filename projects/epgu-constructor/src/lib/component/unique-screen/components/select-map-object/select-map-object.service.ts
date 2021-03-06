import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import {
  ConfigService,
  IGeoCoords,
  IGeoCoordsResponse,
  KINDERGARTEN_SEARCH_RADIUS_IN_METERS,
  YandexMapService,
  YMapItem,
} from '@epgu/epgu-constructor-ui-kit';
import { filter } from 'rxjs/operators';
import {
  ComponentBaloonContentDto,
  ComponentDictionaryFilterDto,
} from '@epgu/epgu-constructor-types';
import { YaMapService } from '@epgu/ui/services/ya-map';
import {
  DictionaryItem,
  DictionaryResponseError,
  DictionaryResponseForYMap,
  DictionaryYMapItem,
} from '../../../../shared/services/dictionary/dictionary-api.types';
// eslint-disable-next-line max-len
import { IuikFullDataResponse } from './components/balloon-content-resolver/components/elections-balloon-content/elections-balloon-content.interface';
// eslint-disable-next-line max-len
import { KindergartenSearchPanelService } from './components/search-panel-resolver/components/kindergarten-search-panel/kindergarten-search-panel.service';
import { arePointsEqual } from './select-map-object.helpers';

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
  childrenClubsMap = 'childrenClubsMap',
}

export enum SidebarViewType {
  Map = 'Map',
  List = 'List',
}

@Injectable()
export class SelectMapObjectService implements OnDestroy {
  public dictionary: DictionaryResponseForYMap;

  public filteredDictionaryItems: DictionaryYMapItem[] = [];

  public selectedValue = new Subject();

  public selectedViewItems$ = new BehaviorSubject<DictionaryItem[]>([]);

  public isNoDepartmentErrorVisible = new Subject<boolean>();

  public ymaps;

  public componentAttrs: SelectMapComponentAttrs; // ???????????????? ???????????????????? ???? getNextStep

  public mapEvents; // events ???? ????????, ?????????????????????????????? ?????? ???????????????? ????????????

  public mapOpenedBalloonId: number;

  public mapType = MapTypes.commonMap;

  public isMapLoaded = new BehaviorSubject<boolean>(false);

  public isSelectedView = new BehaviorSubject<boolean>(false);

  public userAddress: string;

  public searchString = new BehaviorSubject<string>(''); // ???????????? ???? ???????????? ????????????

  private _viewType = new BehaviorSubject(SidebarViewType.Map);

  private objectManager;

  private __mapStateCenter: number[];

  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private yaMapService: YaMapService,
    private yandexMapService: YandexMapService,
    private kindergartenSearchPanel: KindergartenSearchPanelService,
  ) {
    this.selectedValue.pipe(filter((value) => !value)).subscribe(() => {
      this.mapOpenedBalloonId = null;
    });
  }

  get isListViewType(): boolean {
    return this._viewType.getValue() === SidebarViewType.List;
  }

  get isMapViewType(): boolean {
    return this._viewType.getValue() === SidebarViewType.Map;
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
    }
    return of({ coords: [], error: '' });
  }

  /**
   * Fill map's objects in Dictionary with geo coords
   * @param dictionary
   * @param coords
   */
  public fillDictionaryItemsWithCoords(coords: IGeoCoordsResponse): void {
    const hashMap = {};
    coords.coords.forEach((coord) => {
      if (coord.address) {
        hashMap[coord.address.toLowerCase()] = {
          latitude: coord.latitude,
          longitude: coord.longitude,
        };
      }
    });
    this.dictionary.items.forEach((item, index) => {
      const coordinates = hashMap[
        (
          (item.attributeValues[this.componentAttrs.attributeNameWithAddress] as string) || ''
        ).toLowerCase()
      ] as IGeoCoords;
      item.objectId = index;
      if (coordinates) {
        item.center = [coordinates.longitude, coordinates.latitude];
      }
      if (this.componentAttrs.baloonContent) {
        item.baloonContent =
          this.getMappedAttrsForBaloon(this.componentAttrs.baloonContent, item) || [];
      }
    });
    this.filteredDictionaryItems = this.dictionary.items;
  }

  /**
   * centers the map by coordinates
   * @param coords
   * @param object
   */
  public centeredPlaceMark(coords: number[], mapItem: YMapItem<DictionaryItem>): void {
    this.closeBalloon();
    const serviceContext = this;
    const offset = -0.00008;

    if (coords && coords[0] && coords[1]) {
      const center = this.yaMapService.map.getCenter();
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
          this.objectManager.objects.setObjectProperties(mapItem.idForMap, { pinStyle: 'pin-red' });
          serviceContext.objectManager?.objects.balloon.open(mapItem.idForMap);
          serviceContext.__mapStateCenter = serviceContext.yaMapService.map.getCenter();
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
  public searchMapObject(searchString: string): DictionaryYMapItem[] {
    const searchStringLower = searchString.toLowerCase();
    this.searchString.next(searchStringLower);
    const searchSource = this.isSelectedView.getValue()
      ? this.selectedViewItems$.getValue()
      : this.dictionary.items;
    const searchResult = searchSource.filter((item) => {
      const address = (item.attributeValues[
        this.componentAttrs.attributeNameWithAddress
      ] as string)?.toLowerCase();
      return (
        item.title?.toLowerCase().includes(searchStringLower) ||
        address?.includes(searchStringLower)
      );
    }) as DictionaryYMapItem[];
    const items = this.convertDictionaryItemsToMapPoints(searchResult);
    this.yandexMapService.placeObjectsOnMap(items);
    if (!this.isSelectedView.getValue()) {
      this.filteredDictionaryItems = searchResult;
    }
    this.handleSelectedSearchResultPainting(searchResult);
    return searchResult;
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
   * ?????????????????? ?????????????? ?? ?????????????? ?????????????????????? ????????????????????????
   * @param coords ???????????? ?????? ?????????????????? ?????? ????????????????
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
    const path = `${this.config.lkuipElection}/api/map/uikFullData?pollStationNumber=${pollStationNumber}&pollStationRegion=${pollStationRegion}&electionDate=${electionDate}&electionLevel=${electionLevel}`;
    return (this.http.get<IuikFullDataResponse>(path, {
      ...options,
      withCredentials: true,
    }) as unknown) as Observable<IuikFullDataResponse>;
  }

  // TODO ?????????? ???????????????? ???????????????????? ???????????????????????? ???? ?????????? ???? ???????????? ??????????
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

  public resetSelectedView(): void {
    this.isSelectedView.next(false);
    this.selectedViewItems$.next([]);
    this.yandexMapService.selectedValue$.next(null);
    this.yandexMapService.placeObjectsOnMap(
      this.convertDictionaryItemsToMapPoints(this.filteredDictionaryItems),
    );
  }

  /**
   * ???????????????????????????? ???????????? ?? ?????????????? ???? ?????????????????????? ?????? ?????????????????????? ?? ????????????
   * @param attrs ???????????? ?? ???????????????????? ?????? ?????????????????????? ?? ????????????
   * @param item
   */
  public getMappedAttrsForBaloon(
    attrs: { name: string; label: string }[],
    item: DictionaryYMapItem,
  ): { value: string; label: string }[] {
    const res = [];
    attrs.forEach((attr) => {
      const itemValue = item.attributeValues[attr.name];
      if (itemValue) {
        res.push({
          value: itemValue,
          label: attr.label,
        });
      }
    });
    return res;
  }

  public setViewType(type: SidebarViewType): void {
    this._viewType.next(type);
  }

  /**
   * ???????????????????? ??????????, ???????????????????????? ?????????????????? point, ???????????????????????? ?????????????????? center
   * @param point ??????????
   * @param center ?????????? ??????????????????
   */
  public getReflectionPoint(point: number[], center: number[]): number[] {
    const longitudeDifference = point[0] - center[0];
    const reflectionLongitude = center[0] - longitudeDifference;
    const latitudeDifference = point[1] - center[1];
    const reflectionLatitude = center[1] - latitudeDifference;
    return [reflectionLongitude, reflectionLatitude];
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
   * ?????????????????????? ?????????????? ?????? ??????????. ?????? ?????????? ?? ?????????????????????? ???????????????????????? ?????????????? ?? ???????? ???????????????? ???????????? children
   * @param dictionary - ?????????????? ?????? ????????????????????????
   */
  private normalizeDictionaryForMap(dictionary: DictionaryResponseForYMap): void {
    const newItems = [];
    dictionary.items.forEach((item: DictionaryYMapItem) => {
      if (!item.center) {
        return;
      }
      // agreement - ?????????????? ???????????????? ?? ?????????????????? ?????????? ?????? ????????????
      const attrValues = item.attributeValues;
      item.agreement = attrValues.GET_CONSENT !== 'true';
      item.idForMap = item.objectId;
      newItems.push(item);
    });
    this.dictionary.items = newItems;
    this.filteredDictionaryItems = newItems;
  }

  private handleSelectedSearchResultPainting(searchResult: DictionaryYMapItem[]): void {
    const selectedValue: DictionaryYMapItem[] = this.yandexMapService.selectedValue$.getValue();
    if (selectedValue) {
      searchResult.forEach((resultItem) => {
        const resultIsInSelectedValues = selectedValue.find((value) =>
          arePointsEqual(value, resultItem),
        );
        if (resultIsInSelectedValues) {
          const feature = this.yandexMapService.getObjectById(resultItem.idForMap);
          if (feature) {
            this.yandexMapService.markPointAsActive(feature);
          }
        }
      });
      this.yandexMapService.mapPaint();
    }
  }
}
