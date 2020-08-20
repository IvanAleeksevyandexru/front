import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { YaMapService } from 'epgu-lib';
import { Icons } from './constants';
import { ConstructorConfigService } from '../../../../services/config/constructor-config.service';
import { IGeoCoordsResponse } from './select-map-object.interface';

@Injectable()
export class SelectMapObjectService {

  public dictionary;
  public filteredDictionaryItems = [];
  public map;
  public controlValue = new Subject();
  public ymaps;

  private objectManager;
  private baloonContentMap = [{ name: 'ADDRESS', label: 'Адрес' }, { name: 'PHONE', label: 'Телефон' }, { name: 'EMAIL', label: 'Email' }];
  private activePlacemarkId;

  constructor(
    private http: HttpClient,
    private constructorConfigService: ConstructorConfigService,
    private yaMapService: YaMapService,
    private ngZone: NgZone,
  ) { }

  /**
   * Returns geo coords of physical addresses array
   * @param items
   */
  public getCoordsByAddress(items): Observable<any> {
    const path = `${this.constructorConfigService.config.externalApiUrl}/address/resolve`;
    return this.http.post(path, {
      address: items.map(item => item.attributeValues.ADDRESS),
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
    this.filteredDictionaryItems.forEach((item, index) => {
      const coords = hashMap[item.attributeValues.ADDRESS];
      item.id = index;
      if (coords) {
        item.center = [coords.longitude, coords.latitude];
      }
      item.baloonContent = this.getMappedAttrsForBaloon(this.baloonContentMap, item);
    });
  }

  /**
   * prepares and returns collection of objects for yandex map
   * @param items geo objects
   */
  public prepareFeatureCollection(items) {
    const res = { type: 'FeatureCollection', features: [] };
    items.forEach((item, index) => {
      if (item.center) {
        const obj = {
          type: 'Feature',
          id: index,
          geometry: { type: 'Point', coordinates: item.center },
          properties: {
            res: { ...item, btnName: 'Выбрать' },
          },
        }
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
    this.objectManager.objects.options.set(Icons.blue);
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
      geoObjectBalloonOffset: [-160, -350],
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
      this.centeredPlaceMark(coords, objectId);
    });

    objectManager.objects.balloon.events.add('userclose', () => {
      objectManager.objects.setObjectOptions(this.activePlacemarkId, {
        iconImageHref: Icons.blue.iconImageHref
      });
    });

    return objectManager;
  }

  private getCustomBalloonContentLayout() {
    if (typeof this.ymaps.templateLayoutFactory == 'undefined') {
      return;
    }
    const componentContext = this;
    const btnTemplateDesk =
      '{% if properties.res.btnName %}' +
      '<div class=\'FieldMapWithList-buttonwrap\'>' +
      '{% if !properties.res.btnFromCluster %}' +
      // TODO: replace with <lib-button>
      '<a tabindex=\'1\' href=\'#\' data-objectid=\'{{properties.res.id}}\' ' +
      'class=\'btn-balloon btn_base btn_small btn_blue\'>{{properties.res.btnName}}</a>' +
      '{% endif %}' +
      '{% if properties.res.btnFromCluster && properties.res.itemData && properties.res.itemData.code %}' +
      '<a tabindex=\'1\' href=\'#\' data-objectid=\'{{properties.res.itemData.code}}\' ' +
      'class=\'btn-balloon btn_base btn_small btn_blue\'>{{properties.res.btnName}}</a>' +
      '{% endif %}' +
      '{% if properties.res.btnFromCluster && properties.res.itemData && properties.res.itemData.numIk %}' +
      '<a tabindex=\'1\' href=\'#\' data-objectid=\'{{properties.res.itemData.id}}\' ' +
      'class=\'btn-balloon btn_base btn_small btn_blue\'>{{properties.res.btnName}}</a>' +
      '{% endif %}' +
      '{%  if properties.res.btnFromCluster && !properties.res.itemData && properties.res.id >= 0 %}' +
      '<a tabindex=\'1\' href=\'#\' data-objectid=\'{{properties.res.id}}\' ' +
      'class=\'btn-balloon btn_base btn_small btn_blue\'>{{properties.res.btnName}}</a>' +
      '{% endif %}' +
      '</div>' +
      '{% endif %}';

    const customBalloonContentLayout = this.ymaps.templateLayoutFactory.createClass(
      '<div class=\'map-baloon\'>' +
      '<div class=\'map-baloon-content\'>' +
      '<h6 class=\'map-baloon-content-Header\'>{{properties.res.title}}</h6>' +
      '{% if properties.res.baloonContent && properties.res.baloonContent.length %}' +
      '{% for cont in properties.res.baloonContent %}' +
      '{% if cont.value %}' +
      '<div class=\'PGU-FieldMapWithList-Item-Attrs\'>' +
      '{% if cont.label %}' +
      '<label>{{cont.label}}: </label>' +
      '{% endif %}' +
      '<span class=\'PGU-AttrsValue\'>{{cont.value|raw}}</span>' +
      '</div>' +
      '{% endif %}' +
      '{% endfor  %}' +
      '{% endif %}' +
      '<div class="map-baloon-content-Bottom">' +
      'На данной площадке действуют дополнительные условия оказания услуг нажмите чтобы <a href="#!">ознакомиться</a></div>' +
      '</div>' +
      btnTemplateDesk +
      '</div>',
      {
        // Переопределяем функцию build, чтобы при создании макета начинать
        // слушать событие click на кнопке
        build: function () {
          // Сначала вызываем метод build родительского класса.
          customBalloonContentLayout.superclass.build.call(this);
          // Биндим к кнопке клик
          // let parentElement = angular.element(this.getParentElement());
          let parentElement = this.getParentElement();
          parentElement.querySelector('.btn-balloon').addEventListener('click', this.onClick);
        },

        // Аналогично переопределяем функцию clear, чтобы снять
        // прослушивание клика при удалении макета с карты.
        clear: function () {
          // Выполняем действия в обратном порядке - сначала снимаем слушателя,
          // а потом вызываем метод clear родительского класса.
          this.getParentElement().querySelector('.btn-balloon').removeEventListener('click', this.onClick);
          customBalloonContentLayout.superclass.clear.call(this);
        },

        onClick: function (e) {
          e.preventDefault();
          const objectId = e.target.getAttribute('data-objectid');
          let checkedId = objectId || this.activePlacemark.id.toString();
          let item;
          if (checkedId) {
            item = componentContext.objectManager.objects.getById(checkedId).properties.res;
            componentContext.controlValue.next(item);
          }
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
    let offset = 0.0003;

    this.objectManager && this.objectManager.objects.setObjectOptions(objectId, {
      iconImageHref: Icons.red.iconImageHref
    });
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

      if (!equal || (equal && serviceContext.__mapOpenedBalloonId !== objectId)) {
        this.yaMapService.map.zoomRange.get([coords[0], coords[1]]).then(function (range) {
          serviceContext.yaMapService.map.setCenter([coords[0], coords[1] + offset], range[1] - 2);
          // Таймаут нужен что бы балун всегда нормально открывался
          // по непонятным причинам без таймаута балун иногда не открывается
          setTimeout(() => {
            serviceContext.objectManager.objects.balloon.open(objectId);
            serviceContext.yaMapService.map.setCenter([coords[0], coords[1] + offset]);
            serviceContext.__mapStateCenter = serviceContext.yaMapService.map.getCenter();
            serviceContext.__mapOpenedBalloonId = objectId;
            serviceContext.preventBoundsChangeBalloon = false;
          }, 600);
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
    return res
  }

  /**
   * filter geo items by searchString and redraw map
   * @param searchString 
   */
  public searchMapObject(searchString: string) {
    const searchStringLower = searchString.toLowerCase();
    this.filteredDictionaryItems = this.dictionary?.items.filter((item) => {
      return item.title?.toLowerCase().includes(searchStringLower)
        || item.attributeValues.ADDRESS.toLowerCase().includes(searchStringLower);
    });
    this.placeOjectsOnMap(this.yaMapService.map);
  }
}
