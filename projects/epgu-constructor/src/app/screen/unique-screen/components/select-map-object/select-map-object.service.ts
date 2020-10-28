import { Injectable, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { YaMapService } from 'epgu-lib';
import { Icons } from './constants';
import { ConfigService } from '../../../../shared/config/config.service';
import { IGeoCoordsResponse } from './select-map-object.interface';
import { DictionaryResponseForYMap, DictionaryYMapItem } from '../../../services/dictionary-api/dictionary-api.types';

@Injectable()
export class SelectMapObjectService {

  public dictionary: DictionaryResponseForYMap;
  public filteredDictionaryItems = [];
  public selectedValue = new Subject();
  public ymaps;
  public templates: { [key: string]: TemplateRef<any> } = {}; // Шаблоны для модалки
  public componentAttrs: any; // Атрибуты компонента из getNextStep
  public mapEvents; // events от карт, устанавливаются при создание балуна
  public mapOpenedBalloonId: number;

  private objectManager;
  private activePlacemarkId;

  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private yaMapService: YaMapService,
    private icons: Icons,
  ) { }

  /**
   * Returns geo coords of physical addresses array
   * @param items
   */
  public getCoordsByAddress(items) {
    const path = `${this.config.externalApiUrl}/address/resolve`;
    return this.http.post<IGeoCoordsResponse>(path, {
      address: items.map(item => item.attributeValues[this.componentAttrs.attributeNameWithAddress]),
    });
  }

  /**
   * Fill map's objects in Dictionary with geo coords
   * @param dictionary
   * @param coords
   */
  public fillDictionaryItemsWithCoords(coords: IGeoCoordsResponse) {
    const hashMap = {};
    coords.coords.forEach(coord => {
      hashMap[coord.address] = { latitude: coord.latitude, longitude: coord.longitude };
    });
    this.dictionary.items.forEach((item, index) => {
      const coords = hashMap[item.attributeValues[this.componentAttrs.attributeNameWithAddress]];
      item.idForMap = index;
      if (coords) {
        item.center = [coords.longitude, coords.latitude];
      }
      item.baloonContent = this.getMappedAttrsForBaloon(this.componentAttrs.baloonContent, item) || [];
    });
    this.filteredDictionaryItems = this.dictionary.items;
  }

  /**
   * prepares and returns collection of objects for yandex map
   * @param items geo objects
   */
  public prepareFeatureCollection(items) {
    const res = { type: 'FeatureCollection', features: [] };
    items.forEach((item) => {
      if (item.center) {
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
  public placeOjectsOnMap(map) {
    const objects = this.prepareFeatureCollection(this.filteredDictionaryItems);

    this.objectManager = this.createMapsObjectManager();
    this.objectManager.objects.options.set(this.icons.blue);
    this.objectManager.objects.options.set('balloonContentLayout', this.getCustomBalloonContentLayout());
    this.objectManager.objects.options.set('balloonLayout', this.getCustomBalloonContentLayout());
    this.objectManager.add(objects);
    map.geoObjects.removeAll();
    map.geoObjects.add(this.objectManager);
  }

  /**
   * returns yandex ObjectManager to work with map's objects
   */
  private createMapsObjectManager() {
    const OMSettings = {
      clusterize: !0,
      minClusterSize: 2,
      gridSize: 128,
      geoObjectBalloonMaxWidth: 265,
      geoObjectBalloonOffset: [0, 0],
      geoObjectHideIconOnBalloonOpen: !1,
      geoObjectIconColor: '#0D69AF',
      viewportMargin: 300,
      zoomMargin: 64,
      clusterBalloonItemContentLayout: this.getCustomBalloonContentLayout()
    };

    const objectManager = new this.ymaps.ObjectManager(OMSettings);

    objectManager.objects.events.add('click', (evt) => {
      let objectId = evt.get('objectId');
      let obj = objectManager.objects.getById(objectId);
      let coords = obj.geometry.coordinates;
      this.selectedValue.next(obj.properties.res);
      this.centeredPlaceMark(coords, objectId);
    });

    objectManager.objects.balloon.events.add('userclose', () => {
      objectManager.objects.setObjectOptions(this.activePlacemarkId, {
        iconImageHref: this.icons.blue.iconImageHref
      });
      this.selectedValue.next(null);
    });

    return objectManager;
  }

  private getCustomBalloonContentLayout() {
    if (typeof this.ymaps.templateLayoutFactory == 'undefined') {
      return;
    }
    const serviceContext = this;
    const customBalloonContentLayout = this.ymaps.templateLayoutFactory.createClass('',
      {
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

        onClick: function (e) {
          e.preventDefault();
          const objectId = e.target.getAttribute('data-objectid');
          let checkedId = objectId || this.activePlacemark.id.toString();
          if (checkedId) {
            const item = serviceContext.objectManager.objects.getById(checkedId).properties.res;
            serviceContext.selectedValue.next(item);
          }
        },

        onCloseClick: function (e) {
          e.preventDefault();
          this.events.fire('userclose');
        },
      }
    );
    return customBalloonContentLayout;
  }

  /**
   * centers the map by coordinates
   * @param coords
   * @param objectId
   */
  public centeredPlaceMark(coords, objectId) {
    let serviceContext = this as any;
    let offset = -0.00008;

    this.activePlacemarkId = objectId;

    if (coords && coords[0] && coords[1]) {
      let center = this.yaMapService.map.getCenter();
      let equal = true;
      if (!serviceContext.__mapStateCenter) {
        serviceContext.__mapStateCenter = [];
      }
      if (serviceContext.__mapStateCenter[1] !== center[1]) {
        equal = false;
      }

      if (!equal || (equal && serviceContext.mapOpenedBalloonId !== objectId)) {
        this.yaMapService.map.zoomRange.get([coords[0], coords[1]]).then(function (range) {
          serviceContext.yaMapService.map.setCenter([coords[0], coords[1] + offset], range[1] - 2);
          // Таймаут нужен что бы балун всегда нормально открывался
          // по непонятным причинам без таймаута балун иногда не открывается
          setTimeout(() => {
            serviceContext.objectManager && serviceContext.objectManager.objects.setObjectOptions(objectId, {
              iconImageHref: serviceContext.icons.red.iconImageHref
            });
            serviceContext.objectManager.objects.balloon.open(objectId);
            serviceContext.yaMapService.map.setCenter([coords[0], coords[1] + offset]);
            serviceContext.__mapStateCenter = serviceContext.yaMapService.map.getCenter();
            serviceContext.mapOpenedBalloonId = objectId;
            serviceContext.preventBoundsChangeBalloon = false;
            serviceContext.selectedValue.next(serviceContext.objectManager.objects.getById(objectId).properties.res);
          }, 200);
        });
      }
    }
  }

  /**
   * Returns array with attributes to show in balloon on map
   * @param attrs map with attributes to extract
   * @param item
   */
  private getMappedAttrsForBaloon(attrs: Array<{ name: string, label: string }>, item) {
    const res = [];
    attrs.forEach((attr) => {
      let itemValue = item.attributeValues[attr.name];
      res.push({
        value: itemValue,
        label: attr.label,
      });
    });
    return res;
  }

  /**
   * filter geo items by searchString and redraw map
   * @param searchString
   */
  public searchMapObject(searchString: string) {
    const searchStringLower = searchString.toLowerCase();
    this.filteredDictionaryItems = this.dictionary?.items.filter((item) => {
      const address = (item.attributeValues[this.componentAttrs.attributeNameWithAddress])?.toLowerCase();
      return item.title?.toLowerCase().includes(searchStringLower)
        || address?.includes(searchStringLower);
    });
    this.placeOjectsOnMap(this.yaMapService.map);
  }

  public findObjectByValue(value: string): DictionaryYMapItem {
    return this.filteredDictionaryItems.find((object) => object.value === value);
  }

  public centeredPlaceMarkByObjectValue(value: string) {
    const valueFromDict = this.findObjectByValue(value);
    if (valueFromDict?.center) {
      this.centeredPlaceMark(valueFromDict.center, valueFromDict.idForMap);
    }
  }

  /**
   * Заполняет словарь в сервисе полученными координатами
   * @param coords массив гео координат для объектов
   */
  public saveCoords(coords: IGeoCoordsResponse) {
    this.fillDictionaryItemsWithCoords(coords);
    this.normalizeDictionaryForMap(this.dictionary);
  }

  public closeBalloon() {
    this.mapEvents.fire('userclose');
  }

  /**
   * Нормализует словарь под карту. Все точки с одинаковыми координатами сливает в одну заполняя массив children
   * @param dictionary - словарь для нормализации
   */
  private normalizeDictionaryForMap(dictionary: DictionaryResponseForYMap): void {
    const newItems = [];
    const hashMap = {};
    dictionary.items.forEach((item: DictionaryYMapItem) => {
      const hashKey = `${item.center[0]}$${item.center[1]}`;
      // agreement - чекбокс согласия с условиями услуг для загсов
      item.agreement = item.attributeValues.GET_CONSENT !== 'true';
      if (hashMap[hashKey]) {
        hashMap[hashKey].children.push(item);
      } else {
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
}
