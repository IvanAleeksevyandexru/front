import { Injectable, OnDestroy } from '@angular/core';
import { YaMapService } from '@epgu/ui/services/ya-map';
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
  YMapItem,
} from './yandex-map.interface';
import { ymaps } from './yandex-map.types';
import IDirectProblemSolution = ymaps.IDirectProblemSolution;

const POINT_ON_MAP_OFFSET = -0.00008; // оффсет для точки на карте чтобы панель поиска не перекрывала точку

@Injectable()
export class YandexMapService implements OnDestroy {
  public selectedValue$ = new BehaviorSubject(null);
  public ymaps;
  public mapOptions;

  private objectManager;
  private activePlacemarkId: number | string;
  private activeClusterHash: string;
  private MIN_ZOOM = 4;
  private MAX_ZOOM = 17;
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
        this.setMapOptions(this.deviceDetector.isMobile, this.mapOptions);
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
      if (item.center[0] && item.center[1]) {
        const obj = {
          type: 'Feature',
          id: index,
          geometry: { type: 'Point', coordinates: item.center },
          properties: {
            res: { ...item.obj },
          },
          options: item.obj.isSelected ? this.icons.redChecked : this.icons.blue,
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
  public placeObjectsOnMap<T>(
    items: IYMapPoint<T>[],
    OMSettings?,
    urlTemplate?: string,
    LOMSettings?,
  ): void {
    this.objectManager = this.createMapsObjectManager(OMSettings, urlTemplate, LOMSettings);
    this.objectManager.objects.options.set(this.icons.blue);
    this.objectManager.clusters.options.set('clusterIcons', [this.icons.clusterBlue]);
    this.objectManager.objects.options.set(
      'balloonContentLayout',
      this.getCustomBalloonContentLayout(),
    );
    this.objectManager.objects.options.set('balloonLayout', this.getCustomBalloonContentLayout());

    if (!urlTemplate) {
      const objects = this.prepareFeatureCollection(items);
      this.objectManager.add(objects);
    }

    this.yaMapService.map.geoObjects.removeAll();
    this.addObjectsOnMap(this.objectManager);
  }

  public addObjectsOnMap(object: ymaps.ObjectManager | ymaps.Placemark): void {
    this.yaMapService.map.geoObjects.add(object);
  }

  /**
   * centers the map by feature
   * @param feature
   */
  public centeredPlaceMark<T>(feature: IFeatureItem<T> | IClusterItem<T>): void {
    this.closeBalloon();
    if (
      feature.type === IFeatureTypes.Cluster &&
      this.isClusterZoomable(feature as IClusterItem<T>)
    ) {
      return;
    }
    this.activePlacemarkId = feature.id;
    const coords = feature.geometry?.coordinates;
    if (feature.type === IFeatureTypes.Cluster) {
      this.activeClusterHash = this.getClusterHash(feature as IClusterItem<T>);
      this.paintActiveCluster(this.icons.clusterRed);
    }
    if (coords && coords[0] && coords[1] && feature.type === IFeatureTypes.Feature) {
      this.objectManager.objects.setObjectOptions(feature.id as number, this.icons.red);
      this.yaMapService.map.setCenter([coords[0], coords[1] + POINT_ON_MAP_OFFSET]);
    }

    const object =
      feature.type === IFeatureTypes.Feature
        ? [(feature as IFeatureItem<T>).properties.res]
        : (feature as IClusterItem<T>).properties.geoObjects.map((object) => object.properties.res);
    if (object.length === 1) {
      object[0]['expanded'] = true;
    }
    this.selectedValue$.next(object);
  }

  public getObjectById<T>(id: number): IFeatureItem<T> {
    return this.objectManager.objects.getAll().find((mapObj) => mapObj.properties.res.idForMap === id);
  }

  public handleFeatureSelection<T>(feature: IFeatureItem<T>): void {
    this.objectManager.objects.setObjectOptions(feature.id as number, this.icons.red);
    const object = [(feature as IFeatureItem<T>).properties.res];
    object[0]['expanded'] = true;
    this.selectedValue$.next(object);
  }

  /**
   * centers the map by coords
   * @param coords координаты
   * @param zoom уровень приближения
   */
  public setCenter(coords: [number, number], zoom?: number): void {
    if (coords && coords[0] && coords[1]) {
      this.yaMapService.map.setCenter(coords, zoom);
    }
  }

  public closeBalloon(): void {
    this.selectedValue$.getValue()?.forEach((element) => {
      element.expanded = false;
    });

    const activePlacemark = this.objectManager.objects.getById(this.activePlacemarkId);
    const isSelected = activePlacemark?.properties.res.isSelected;
    this.objectManager.objects.setObjectOptions(
      this.activePlacemarkId as number,
      isSelected ? this.icons.redChecked : this.icons.blue,
    );
    this.selectedValue$.next(null);
    this.paintActiveCluster(this.icons.clusterBlue);
    this.activePlacemarkId = null;
    this.activeClusterHash = null;
    this.mapPaint();
  }

  public setMapOptions(isMobile: boolean, options?): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.ymaps = (window as any).ymaps;
    const mobileTop =
      Number.parseInt(this.yaMapService.map.container.getElement().style.height) / 3;
    this.yaMapService.map.controls.add('zoomControl', {
      position: {
        top: isMobile ? mobileTop : 108,
        right: 10,
        bottom: 'auto',
        left: 'auto',
      },
      size: isMobile ? 'small' : 'large',
    });
    this.yaMapService.map.events.add('actionend', () => this.mapPaint(), this);
    this.yaMapService.map.options.set({
      minZoom: this.MIN_ZOOM,
      maxZoom: this.MAX_ZOOM,
      ...options,
    });
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

  public selectMapObject<T>(mapObject: YMapItem<T>): void {
    if (!mapObject) return;
    let chosenMapObject = this.getObjectById(mapObject.idForMap);
    if (!chosenMapObject) {
      chosenMapObject = {
        geometry: { type: 'Point', coordinates: [null, null] },
        id: 1,
        properties: { res: mapObject },
        type: IFeatureTypes.Feature,
      };
      this.centerAllPoints();
    }
    this.centeredPlaceMark(chosenMapObject);
  }

  public getBoundsByCoords(coords: number[][]): [number[], number[]] {
    const latitudes = coords.map(coord => coord[0]);
    const longitudes = coords.map(coord => coord[1]);
    const leftmost = Math.min(...latitudes);
    const rightmost = Math.max(...latitudes);
    const lowest = Math.min(...longitudes);
    const highest = Math.max(...longitudes);
    const leftBottom = [leftmost, lowest];
    const rightTop = [rightmost, highest];
    return [leftBottom, rightTop];
  }

  public setBounds(bounds: number[][]): void {
    this.yaMapService.map.setBounds(bounds);
  }

  public getDistance(point1: number[], point2: number[]): number {
    return this.ymaps.coordSystem.geo.getDistance(point1, point2);
  }

  /**
   * Где мы окажемся, если выйдем из указанной точки в указанном направлении и пройдём, не сворачивая, указанное расстояние.
   * @param startPoint точка
   * @param direction направление
   * @param distance расстояние
   */
  public solveDirectProblem(startPoint: number[], direction: number[], distance: number): IDirectProblemSolution {
    return this.ymaps.coordSystem.geo.solveDirectProblem(startPoint, direction, distance);
  }

  public createPlacemark(coords: number[], properties?: object, options?: object): ymaps.Placemark {
    return new this.ymaps.Placemark(coords, properties, options);
  }

  /**
   * Перекрашивает точки на карте
   */
     public mapPaint(): void {
      this.objectManager.clusters.getAll().forEach((cluster) => {
        let isClusterWithActiveObject;
        let selectedFeatureCnt = 0;
        let clusterColor;
        for (let feature of cluster.features) {
          if (feature.properties.res.objectId === this.activePlacemarkId) {
            isClusterWithActiveObject = true;
          }
          if (feature.properties.res.isSelected) {
            selectedFeatureCnt++;
          }
        }
        if (
          isClusterWithActiveObject ||
          (selectedFeatureCnt && cluster.features.length > selectedFeatureCnt)
        ) {
          clusterColor = this.icons.clusterBlueRed;
        } else if (cluster.features.length === selectedFeatureCnt) {
          clusterColor = this.icons.clusterRed;
        } else {
          clusterColor = this.icons.clusterBlue;
        }
        const currentColor = JSON.stringify(
          this.objectManager.clusters.getById(cluster.id).options.clusterIcons,
        );
        if (currentColor !== JSON.stringify([clusterColor])) {
          this.objectManager.clusters.setClusterOptions(cluster.id, {
            clusterIcons: [clusterColor],
          });
        }
      });
      this.paintActiveCluster(this.icons.clusterRed);
    }

  private getClusterHash<T>(cluster: IClusterItem<T>): string {
    return cluster.features.map(({ id }) => id).join('$');
  }

  private getClusterByHash(clusterHash: string): IClusterItem<unknown> {
    return this.objectManager.clusters.getAll().find((cluster) => {
      return this.getClusterHash(cluster) === clusterHash;
    });
  }

  private paintActiveCluster(color): void {
    const cluster = this.getClusterByHash(this.activeClusterHash);
    if (cluster) {
      this.objectManager.clusters.setClusterOptions(cluster.id, {
        clusterIcons: [color],
      });
    }
  }

  private createMapsObjectManager(
    OMSettings,
    urlTemplate: string,
    LOMSettings,
  ): ymaps.ObjectManager {
    const objectManager = urlTemplate
      ? this.createLoadingObjectManager(urlTemplate, LOMSettings)
      : this.createObjectManager(OMSettings);

    objectManager.objects.events.add(
      'click',
      (evt) => {
        let objectId = evt.get('objectId');
        let obj = objectManager.objects.getById(objectId) as IFeatureItem<unknown>;
        this.centeredPlaceMark(obj);
      },
      this,
    );

    objectManager.clusters.events.add('click', (evt) => {
      let clustersId = evt.get('objectId');
      let cluster = objectManager.clusters.getById(clustersId) as IClusterItem<unknown>;
      this.centeredPlaceMark(cluster);
    });

    return objectManager;
  }

  private createObjectManager(settings?): ymaps.ObjectManager {
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
      ...settings,
    };

    return new this.ymaps.ObjectManager(OMSettings);
  }

  private createLoadingObjectManager(
    urlTemplate: string = 'http://mobiz.cowry.team/api/map/uiks?bbox=%b',
    settings?,
  ): ymaps.ObjectManager {
    const LOMSettings = {
      clusterize: true,
      hasBalloon: false,
      splitRequests: false,
      paddingTemplate: 'uik_%b',
      ...settings,
    };

    const objectManager = new this.ymaps.LoadingObjectManager(urlTemplate, LOMSettings);

    // Маппинг ответа от бэка
    objectManager.objects.events.add('add', (evt) => {
      let objectId = evt.get('objectId');
      let obj = this.objectManager.objects.getById(objectId);
      obj.properties = {
        res: {
          ...obj.properties,
        },
      };
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
        feature.geometry.coordinates[0] !== arr[i - 1].geometry.coordinates[0] ||
        feature.geometry.coordinates[1] !== arr[i - 1].geometry.coordinates[1]
      );
    });
  }

  private getCustomBalloonContentLayout(): unknown {
    if (typeof this.ymaps.templateLayoutFactory == 'undefined') {
      return;
    }
    const customBalloonContentLayout = this.ymaps.templateLayoutFactory.createClass('', {
      // Переопределяем функцию build, чтобы при создании макета начинать
      // слушать событие click на кнопке
      build: function () {
        // Сначала вызываем метод build родительского класса.
        customBalloonContentLayout.superclass.build.call(this);
      },
    });
    return customBalloonContentLayout;
  }
}
