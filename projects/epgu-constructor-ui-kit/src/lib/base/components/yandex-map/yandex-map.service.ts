import { Injectable, OnDestroy } from '@angular/core';
import { YaMapService } from '@epgu/ui/services/ya-map';
import { BehaviorSubject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { DeviceDetectorService } from '../../../core/services/device-detector/device-detector.service';
import { UnsubscribeService } from '../../../core/services/unsubscribe/unsubscribe.service';
import { Icons } from './constants';
import { MapLayouts } from './mapLayouts';
import {
  IFeatureTypes,
  IClusterItem,
  IFeatureCollection,
  IFeatureItem,
  IYMapPoint,
  YMapItem,
} from './yandex-map.interface';
import { IDirectProblemSolution } from './yandex-map.interface';
import type * as ymaps from 'yandex-maps';
import { get } from 'lodash';
import { ComponentAttrsDto } from '@epgu/epgu-constructor-types';

const POINT_ON_MAP_OFFSET = -0.00008; // оффсет для точки на карте чтобы панель поиска не перекрывала точку

@Injectable()
export class YandexMapService implements OnDestroy {
  public selectedValue$ = new BehaviorSubject(null);
  public ymaps;
  public mapOptions;

  public objectManager;
  public componentAttrs: ComponentAttrsDto;
  public needMiniBalloonLogic = false;
  private activePlacemarkId: number | string;
  private activeClusterHash: string;
  private MIN_ZOOM = 4;
  private MAX_ZOOM = 17;
  private DEFAULT_ZOOM = 9;
  private hoverPinId: number;

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
          id: item.id || index,
          geometry: { type: 'Point', coordinates: item.center },
          properties: {
            res: { ...item.obj },
            pinStyle: item.obj.isSelected ? 'pin-red-checked' : 'pin-blue',
            miniBalloonText: this.getMiniBalloonText(item),
          },
          options: this.icons.blue,
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
    if (this.needMiniBalloonLogic) {
      this.initMiniBalloonEvents();
      this.objectManager.objects.options.set('balloonLayout', MapLayouts.getCommonBalloonLayout());
      this.objectManager.objects.options.set(
        'balloonContentLayout',
        this.getCustomBalloonContentLayout(),
      );
    }
    this.objectManager.objects.options.set(this.icons.blue);
    this.objectManager.clusters.options.set('clusterIcons', [this.icons.clusterBlue]);

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
  public centeredPlaceMark<T>(
    feature: IFeatureItem<T> | IClusterItem<T>,
    zoomToObject = false,
    needSetCenter = true,
  ): void {
    this.objectManager.objects.balloon.close();
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
      this.objectManager.objects.setObjectProperties(feature.id, { pinStyle: 'pin-red' });
      if (needSetCenter) {
        this.yaMapService.map.setCenter(
          [coords[0], coords[1] + POINT_ON_MAP_OFFSET],
          zoomToObject ? this.MAX_ZOOM : undefined,
        );
      }
    }

    const object =
      feature.type === IFeatureTypes.Feature
        ? [(feature as IFeatureItem<T>).properties.res]
        : (feature as IClusterItem<T>).properties.geoObjects.map((object) => object.properties.res);
    this.objectManager.objects.setObjectProperties(feature.id, { isActive: true });
    this.selectedValue$.next(object);
  }

  public getObjectById<T>(id: number): IFeatureItem<T> {
    return this.objectManager.objects
      .getAll()
      .find((mapObj) => mapObj.properties.res.idForMap === id);
  }

  public handleFeatureSelection<T>(feature: IFeatureItem<T>): void {
    this.objectManager.objects.setObjectProperties(feature.id, { pinStyle: 'pin-red' });
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
    this.objectManager.objects.setObjectProperties(this.activePlacemarkId, {
      isActive: false,
      pinStyle: isSelected ? 'pin-red-checked' : 'pin-blue',
    });

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
    // Создаем новый pane для пинов, которые должны быть выше минибалунов
    const hoverPinPane = new this.ymaps.pane.MovablePane(this.yaMapService.map, { zIndex: 800 });
    this.yaMapService.map.panes.append('hoverPinPane', hoverPinPane);
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

  public selectMapObject<T>(mapObject: YMapItem<T>, zoomToObject = false): void {
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
    this.centeredPlaceMark(chosenMapObject, zoomToObject);
  }

  public getBoundsByCoords(coords: number[][]): [number[], number[]] {
    const latitudes = coords.map((coord) => coord[0]);
    const longitudes = coords.map((coord) => coord[1]);
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
  public solveDirectProblem(
    startPoint: number[],
    direction: number[],
    distance: number,
  ): IDirectProblemSolution {
    return this.ymaps.coordSystem.geo.solveDirectProblem(startPoint, direction, distance);
  }

  public createPlacemark(coords: number[], properties?: object, options?: object): ymaps.Placemark {
    return new this.ymaps.Placemark(coords, properties, options);
  }

  /**
   * Перекрашивает точки на карте
   */
  public mapPaint(): void {
    this.objectManager?.clusters.getAll().forEach((cluster) => {
      let isClusterWithActiveObject;
      let selectedFeatureCnt = 0;
      let clusterColor;
      const idsFromActiveCluster = this.activeClusterHash && this.activeClusterHash.split('$').map(id => +id);
      for (let feature of cluster.features) {
        if (this.activePlacemarkId &&
          (this.activePlacemarkId === feature.properties.res.objectId || this.activePlacemarkId === feature.id)) {
          isClusterWithActiveObject = true;
        }
        if (idsFromActiveCluster && idsFromActiveCluster.includes(feature.id)) {
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
    return this.objectManager?.clusters.getAll().find((cluster) => {
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
      let cluster = (objectManager.clusters.getById(clustersId) as unknown) as IClusterItem<
        unknown
      >;
      this.centeredPlaceMark(cluster);
    });

    return objectManager;
  }

  private initMiniBalloonEvents(): void {
    const closeMiniBalloon = (objectId: number): void => {
      this.objectManager.objects.setObjectProperties(objectId, { pinStyle: 'pin-blue' });
      this.objectManager.objects.setObjectOptions(objectId, { pane: 'places' });
      if (objectId === this.hoverPinId) {
        this.objectManager.objects.balloon.close();
      }
    };
    this.objectManager.objects.events.add('mouseenter', (evt) => {
      let objectId = evt.get('objectId');
      if (objectId !== this.hoverPinId) {
        closeMiniBalloon(this.hoverPinId);
      }
      this.hoverPinId = objectId;
      let object = this.objectManager.objects.getById(objectId) as IFeatureItem<unknown>;
      this.objectManager.objects.setObjectProperties(objectId, { pinStyle: 'pin-hover' });
      // TODO смена pane вызывает повторный mouseenter. Стоит попробовать смену pane у всех остальных geoobject кроме этого
      // Кидаем пин на наш pane чтобы он был выше балуна
      this.objectManager.objects.setObjectOptions(objectId, { pane: 'hoverPinPane' });
      clearTimeout(object.properties.activeTimeout);
      if (!object.properties.isActive && !this.objectManager.objects.balloon.isOpen(objectId)) {
        this.objectManager.objects.balloon.open(objectId);
      }
    });

    this.objectManager.objects.events.add('mouseleave', (evt) => {
      let objectId = evt.get('objectId');
      const activeTimeout = setTimeout(() => {
        closeMiniBalloon(objectId);
      }, 500);
      this.objectManager.objects.setObjectProperties(objectId, { activeTimeout });
    });

    this.objectManager.objects.balloon.events.add('mouseenter', (evt) => {
      let object = evt.get('target').balloon.getData();
      clearTimeout(object.properties.activeTimeout);
    });

    this.objectManager.objects.balloon.events.add('mouseleave', (evt) => {
      let object = evt.get('target').balloon.getData();
      const activeTimeout = setTimeout(() => {
        closeMiniBalloon(object.id);
      }, 500);
      this.objectManager.objects.setObjectProperties(object.id, { activeTimeout });
    });
  }

  private createObjectManager(settings?): ymaps.ObjectManager {
    const OMSettings = {
      clusterize: !0,
      minClusterSize: 2,
      gridSize: 128,
      viewportMargin: 300,
      zoomMargin: 64,
      clusterHasBalloon: false,
      openBalloonOnClick: false,
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
    const headerClick = (): void => {
      let obj = this.objectManager.objects.getById(this.hoverPinId) as IFeatureItem<unknown>;
      this.objectManager.objects.balloon.close();
      this.centeredPlaceMark(obj);
    };
    const finalText =
      '{% for text in properties.miniBalloonText %}' +
      '<span class="balloon-text">{{text}}</span>' +
      '{% endfor %}';

    const customBalloonContentLayout = this.ymaps.templateLayoutFactory.createClass(finalText, {
      build: function () {
        customBalloonContentLayout.superclass.build.call(this);
        this._$element = this.getParentElement();
        const header = this.getParentElement().querySelector('.balloon-text');
        header.addEventListener('click', () => {
          headerClick();
        });
      },
    });
    return customBalloonContentLayout;
  }

  private getMiniBalloonText(item: IYMapPoint<unknown>): string[] {
    const componentAttrs = this.componentAttrs;
    return componentAttrs.miniBalloonTexts?.map((textRef: string) => {
      const text = get(item.obj, textRef);
      return text;
    });
  }
}
