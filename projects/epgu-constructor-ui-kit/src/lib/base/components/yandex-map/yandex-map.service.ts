import { Injectable, OnDestroy } from '@angular/core';
import { YaMapService } from '@epgu/epgu-lib';
import { BehaviorSubject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { DeviceDetectorService } from '../../../core/services/device-detector/device-detector.service';
import { UnsubscribeService } from '../../../core/services/unsubscribe/unsubscribe.service';
import { Icons } from './constants';
import {
  IFeatureTypes,
  IClusterItem,
  IFeatureCollection,
  IFeatureItem,
  IYMapPoint,
} from './yandex-map.interface';

const POINT_ON_MAP_OFFSET = -0.00008; // оффсет для точки на карте чтобы панель поиска не перекрывала точку

@Injectable()
export class YandexMapService implements OnDestroy {
  public selectedValue$ = new BehaviorSubject(null);
  public ymaps;

  private objectManager;
  private activePlacemarkId: number;
  private MIN_ZOOM = 4;
  private DEFAULT_ZOOM = 9;

  constructor(
    private yaMapService: YaMapService,
    private icons: Icons,
    private ngUnsubscribe$: UnsubscribeService,
    private deviceDetector: DeviceDetectorService,
  ) {
    this.yaMapService.mapSubject
      .pipe(
        filter((yMap) => yMap),
        takeUntil(this.ngUnsubscribe$),
      )
      .subscribe(() => {
        this.setMapOptions(this.deviceDetector.isMobile);
      });
  }

  ngOnDestroy(): void {
    this.selectedValue$.complete();
  }

  /**
   * prepares and returns collection of objects for yandex map
   * @param items geo objects
   */
  public prepareFeatureCollection<T>(items: IYMapPoint<T>[]): IFeatureCollection<T> {
    const res = { type: 'FeatureCollection', features: [] };
    items.forEach((item, index) => {
      if (item.center) {
        const obj = {
          type: 'Feature',
          id: index,
          geometry: { type: 'Point', coordinates: item.center },
          properties: {
            res: { ...item },
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
  public placeObjectsOnMap<T>(items: IYMapPoint<T>[]): void {
    const objects = this.prepareFeatureCollection(items);

    this.objectManager = this.createMapsObjectManager();
    this.objectManager.objects.options.set(this.icons.blue);
    this.objectManager.objects.options.set(
      'balloonContentLayout',
      this.getCustomBalloonContentLayout(),
    );
    this.objectManager.objects.options.set('balloonLayout', this.getCustomBalloonContentLayout());
    this.objectManager.add(objects);
    this.yaMapService.map.geoObjects.removeAll();
    this.yaMapService.map.geoObjects.add(this.objectManager);
  }

  /**
   * centers the map by coordinates
   * @param coords
   * @param object
   */
  public centeredPlaceMark<T>(feature: IFeatureItem<T> & IClusterItem<T>): void {
    if(feature.type === IFeatureTypes.Cluster && this.isClusterZoomable(feature)) {
      return;
    }
    this.activePlacemarkId = feature.id;
    const coords = feature.geometry.coordinates;

    if (coords && coords[0] && coords[1]) {
      this.yaMapService.map.zoomRange.get([coords[0], coords[1]]).then((range) => {
        this.yaMapService.map.setCenter([coords[0], coords[1] + POINT_ON_MAP_OFFSET], range[1] - 2);
        this.objectManager &&
          this.objectManager.objects.setObjectOptions(feature.id, {
            iconImageHref: this.icons.red.iconImageHref,
          });
        const object =
          feature.type === IFeatureTypes.Feature
            ? [feature.properties.res?.obj]
            : feature.properties.geoObjects.map((object) => object.properties.res.obj);
        this.selectedValue$.next(object);
      });
    }
  }

  public closeBalloon(): void {
    this.selectedValue$.next(null);
    this.objectManager.objects.setObjectOptions(this.activePlacemarkId, {
      iconImageHref: this.icons.blue.iconImageHref,
    });
    this.activePlacemarkId = null;
  }

  public setMapOptions(isMobile: boolean): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.ymaps = (window as any).ymaps;
    this.yaMapService.map.controls.add('zoomControl', {
      position: {
        top: 108,
        right: 10,
        bottom: 'auto',
        left: 'auto',
      },
      size: isMobile ? 'small' : 'large',
    });
    this.yaMapService.map.options.set('minZoom', this.MIN_ZOOM);
    this.yaMapService.map.copyrights.togglePromo();
  }

  public centerAllPoints(): void {
    const bounds = this.yaMapService.map.geoObjects.getBounds();
    if (bounds) {
      this.yaMapService.map
        .setBounds(bounds, {
          checkZoomRange: true,
        })
        .then(() => {
          const zoom = this.yaMapService.map.getZoom();
          // Уменьшаем зум в случае если точки близко или точка одна
          if (zoom > this.DEFAULT_ZOOM) {
            this.yaMapService.map.setZoom(this.DEFAULT_ZOOM);
          }
        });
    }
  }

  /**
   * returns yandex ObjectManager to work with map's objects
   */
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  private createMapsObjectManager() {
    // const serviceContext = this;
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
      clusterHasBalloon: false,
    };

    const objectManager = new this.ymaps.ObjectManager(OMSettings);

    objectManager.objects.events.add(
      'click',
      (evt) => {
        let objectId = evt.get('objectId');
        let obj = objectManager.objects.getById(objectId);
        this.centeredPlaceMark(obj);
      },
      this,
    );

    objectManager.clusters.events.add('click', (evt) => {
      let clustersId = evt.get('objectId');
      let cluster = objectManager.clusters.getById(clustersId);
      this.centeredPlaceMark(cluster);
    });

    return objectManager;
  }

  /**
   * Метод проверяет в кластере точки с разными координатами. Если таковые есть, то кластер можно зумить.
   * @param cluster кластер для проверки
   * @returns {boolean}
   */
  private isClusterZoomable(cluster: IClusterItem<unknown>): boolean {
    return cluster.features.some((feature, index, arr) => {
      const i = index > 0 ? index : 1;
      return (
        feature.geometry.coordinates[0] !== arr[i - 1].geometry.coordinates[0] &&
        feature.geometry.coordinates[1] !== arr[i - 1].geometry.coordinates[1]
      );
    });
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
      },

      clear: function () {
        customBalloonContentLayout.superclass.clear.call(this);
      },

      onClick: function (e: Event) {
        e.preventDefault();
        const objectId = (e.target as Element).getAttribute('data-objectid');
        let checkedId = objectId || this.activePlacemark.id.toString();
        if (checkedId) {
          const item = serviceContext.objectManager.objects.getById(checkedId).properties.res;
          serviceContext.selectedValue$.next(item);
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