import { Injectable, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { YaMapService } from '@epgu/epgu-lib';
import { ConfigService, Icons, IFeatureCollection, IGeoCoordsResponse, YMapItem } from '@epgu/epgu-constructor-ui-kit';
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
import { v4 as uuidv4 } from 'uuid';

export interface SelectMapComponentAttrs {
  attributeNameWithAddress: string;
  baloonContent: Array<ComponentBaloonContentDto>;
  dictionaryType: string;
  dictionaryFilter: Array<ComponentDictionaryFilterDto>;
}

export interface IFillCoordsResponse extends IGeoCoordsResponse {
  dictionaryError?: DictionaryResponseError;
}

@Injectable()
export class SelectMapObjectService implements OnDestroy {
  public dictionary: DictionaryResponseForYMap;
  public filteredDictionaryItems: DictionaryYMapItem[] = [];
  public selectedValue = new Subject();
  public ymaps;
  public templates: { [key: string]: TemplateRef<ViewChild> } = {}; // Шаблоны для модалки
  public componentAttrs: SelectMapComponentAttrs; // Атрибуты компонента из getNextStep
  public mapEvents; // events от карт, устанавливаются при создание балуна
  public mapOpenedBalloonId: number;

  private objectManager;
  private activePlacemarkId;
  private __mapStateCenter: Array<number>;

  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private yaMapService: YaMapService,
    private icons: Icons,
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
  public getCoordsByAddress(items: Array<DictionaryItem>): Observable<IGeoCoordsResponse> {
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
      const coords = hashMap[item.attributeValues[this.componentAttrs.attributeNameWithAddress]];
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
  public prepareFeatureCollection(items: DictionaryYMapItem[]): IFeatureCollection<DictionaryItem> {
    const res = { type: 'FeatureCollection', features: [] };
    items.forEach((item) => {
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
   * place objects on yandex map
   * @param map link to yandex map
   */
  public placeObjectsOnMap(map: YaMapService['map']): void {
    const objects = this.prepareFeatureCollection(this.filteredDictionaryItems);

    this.objectManager = this.createMapsObjectManager();
    this.objectManager.objects.options.set(this.icons.blue);
    this.objectManager.objects.options.set(
      'balloonContentLayout',
      this.getCustomBalloonContentLayout(),
    );
    this.objectManager.objects.options.set('balloonLayout', this.getCustomBalloonContentLayout());
    this.objectManager.add(objects);
    map.geoObjects.removeAll();
    map.geoObjects.add(this.objectManager);
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

    this.activePlacemarkId = mapItem.idForMap;

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
      const address = item.attributeValues[
        this.componentAttrs.attributeNameWithAddress
      ]?.toLowerCase();
      return (
        item.title?.toLowerCase().includes(searchStringLower) ||
        address?.includes(searchStringLower)
      );
    });
    this.placeObjectsOnMap(this.yaMapService.map);
  }

  public findObjectByValue(value: string): DictionaryYMapItem {
    return this.filteredDictionaryItems.find((object) => object.value === value);
  }

  public findObjectByObjectId(objectId: number): DictionaryYMapItem {
    let ret;
    this.filteredDictionaryItems.find((object) => {
      return object.children.find((child: DictionaryYMapItem) => {
        ret = child.objectId === objectId && child;
        return ret;
      });
    });
    return ret;
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

  private getHashKey(center: [number, number]): string {
    return (center[0] && center[1]) ? `${center[0]}$${center[1]}` : uuidv4();
  }

  /**
   * Нормализует словарь под карту. Все точки с одинаковыми координатами сливает в одну заполняя массив children
   * @param dictionary - словарь для нормализации
   */
  private normalizeDictionaryForMap(dictionary: DictionaryResponseForYMap): void {
    const newItems = [];
    const hashMap = {};
    dictionary.items.forEach((item: DictionaryYMapItem) => {
      if (!item.center) {
        return;
      }

      const hashKey = this.getHashKey(item.center);
      // agreement - чекбокс согласия с условиями услуг для загсов
      const attrValues = item.attributeValues;
      item.agreement = attrValues.GET_CONSENT !== 'true';
      if (hashMap[hashKey]) {
        hashMap[hashKey].children.push(item);
        item.children = hashMap[hashKey].children;
        item.idForMap = hashMap[hashKey].idForMap;
      } else {
        item.idForMap = item.objectId;
        item.children.push(item);
        // expanded - флаг для развертывания секции когда есть залы
        item.expanded = true;
        newItems.push(item);
        hashMap[hashKey] = item;
      }
    });
    this.dictionary.items = newItems;
    this.filteredDictionaryItems = newItems;
  }

  /**
   * Returns array with attributes to show in balloon on map
   * @param attrs map with attributes to extract
   * @param item
   */
  private getMappedAttrsForBaloon(
    attrs: Array<{ name: string; label: string }>,
    item: DictionaryYMapItem,
  ): Array<{ name: string; label: string }> {
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

  /**
   * returns yandex ObjectManager to work with map's objects
   */
  // TODO нет в epgu-lib интерфейсов
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  private createMapsObjectManager() {
    const OMSettings = {
      clusterize: !0,
      minClusterSize: 2,
      gridSize: 128,
      geoObjectBalloonMaxWidth: 265,
      geoObjectBalloonOffset: [0, 0],
      geoObjectHideIconOnBalloonOpen: !1,
      viewportMargin: 300,
      zoomMargin: 64,
      clusterBalloonItemContentLayout: this.getCustomBalloonContentLayout(),
    };

    const objectManager = new this.ymaps.ObjectManager(OMSettings);

    objectManager.objects.events.add('click', (evt) => {
      let objectId = evt.get('objectId');
      let obj = this.findObjectByObjectId(objectId);
      this.centeredPlaceMark(obj.center, obj);
    });

    objectManager.objects.balloon.events.add('userclose', () => {
      objectManager.objects.setObjectOptions(this.activePlacemarkId, {
        iconImageHref: this.icons.blue.iconImageHref,
      });
      this.selectedValue.next(null);
    });

    return objectManager;
  }

  // TODO нет в epgu-lib интерфейсов
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  private getCustomBalloonContentLayout() {
    if (typeof this.ymaps.templateLayoutFactory == 'undefined') {
      return;
    }
    const serviceContext = this;
    const customBalloonContentLayout = this.ymaps.templateLayoutFactory.createClass('', {
      // Переопределяем функцию build, чтобы при создании макета начинать
      // слушать событие click на кнопке
      build: function () {
        // Сначала вызываем метод build родительского класса.
        customBalloonContentLayout.superclass.build.call(this);
        serviceContext.mapEvents = this.events;
      },

      clear: function () {
        customBalloonContentLayout.superclass.clear.call(this);
      },

      applyElementOffset: function () {
        const balloon = this.getParentElement().querySelector('.map-baloon');
        balloon.style.left = -(balloon.offsetWidth / 2) + 'px';
        balloon.style.top = -(balloon.offsetHeight + 15) + 'px';
      },

      onClick: function (e: Event) {
        e.preventDefault();
        const objectId = (e.target as Element).getAttribute('data-objectid');
        let checkedId = objectId || this.activePlacemark.id.toString();
        if (checkedId) {
          const item = serviceContext.objectManager.objects.getById(checkedId).properties.res;
          serviceContext.selectedValue.next(item);
        }
      },

      onCloseClick: function (e: Event) {
        e.preventDefault();
        this.events.fire('userclose');
      },
    });
    return customBalloonContentLayout;
  }
}
