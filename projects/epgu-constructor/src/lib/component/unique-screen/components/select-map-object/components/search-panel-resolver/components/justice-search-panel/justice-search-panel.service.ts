import { Injectable, OnDestroy } from '@angular/core';
import {
  Icons,
  IFeatureCollection,
  IFeatureItem,
  MapLayouts,
  YandexMapService,
  JsonHelperService,
  LoggerService,
  HealthService,
} from '@epgu/epgu-constructor-ui-kit';
import { DictionaryConditions, DictionaryUnionKind } from '@epgu/epgu-constructor-types';
import { Subject } from 'rxjs';
import { YaMapService } from '@epgu/ui/services/ya-map';
import { DictionaryApiService } from '../../../../../../../../shared/services/dictionary/dictionary-api.service';
import { DictionaryYMapItem } from '../../../../../../../../shared/services/dictionary/dictionary-api.types';
import { SelectMapObjectService } from '../../../../select-map-object.service';

@Injectable()
export class JusticeSearchPanelService implements OnDestroy {
  public fullAddress = new Subject();

  private courtZones;

  private myPlacemark;

  private arePolygonsVisible;

  constructor(
    private dictionaryApiService: DictionaryApiService,
    private yandexMapService: YandexMapService,
    private yaMapService: YaMapService,
    private icons: Icons,
    private jsonHelperService: JsonHelperService,
    private loggerService: LoggerService,
    private selectMapObjectService: SelectMapObjectService,
    private health: HealthService,
  ) {}

  ngOnDestroy(): void {
    this.fullAddress.complete();
  }

  public initPolygons(): void {
    this.placeMarkLogic();
    this.arePolygonsVisible =
      this.selectMapObjectService.componentAttrs.arePolygonsVisible ?? false;
  }

  public mapClick(coords): void {
    const createPlacemark = (coordinates): void => {
      return new this.yandexMapService.ymaps.Placemark(
        coordinates,
        {},
        {
          draggable: true,
          iconLayout: this.yandexMapService.ymaps.templateLayoutFactory.createClass(
            '<ymaps class="selected-placemark"></ymaps>',
          ),
          hideIconOnBalloonOpen: false,
          balloonContentLayout: this.yandexMapService.ymaps.templateLayoutFactory.createClass(
            '{{ properties.balloonContent }}',
          ),
          balloonLayout: MapLayouts.getJusticeBalloonLayout(),
          balloonPanelMaxMapArea: 0,
          pane: 'hoverPinPane', // Чтобы пин был выше балуна
          ...this.icons.userOrange,
        },
      );
    };

    // Определяем адрес по координатам (обратное геокодирование).
    const setAddress = (coordinates): void => {
      this.yandexMapService.ymaps.geocode(coordinates).then((res) => {
        const firstGeoObject = res.geoObjects.get(0);
        let fullAddress;

        const address = firstGeoObject.getAddressLine();

        this.dictionaryApiService.getDadataNormalize(address).subscribe((response) => {
          fullAddress = response.address.fullAddress;
          this.myPlacemark.properties.set({
            // В качестве контента балуна задаем строку с адресом объекта.
            balloonContent: fullAddress,
          });
          this.fullAddress.next(fullAddress);
          this.preparePolygons();
        });
      });
    };

    if (this.myPlacemark) {
      this.myPlacemark.geometry.setCoordinates(coords);
    } else {
      this.myPlacemark = createPlacemark.apply(this, [coords]);
      this.yaMapService.map.geoObjects.add(this.myPlacemark);
      // Слушаем событие окончания перетаскивания на метке.
      this.myPlacemark.events.add(
        'dragend',
        () => {
          setAddress(this.myPlacemark.geometry.getCoordinates());
        },
        this,
      );
    }
    setAddress(coords);
  }

  private drawPolygonsOnMap(json): void {
    this.courtZones?.removeFromMap(this.yaMapService.map);
    this.courtZones = this.yandexMapService.ymaps.geoQuery(json).addToMap(this.yaMapService.map);
    this.courtZones.each((obj) => {
      obj.options.set({
        fillColor: '#9ACD32',
        hasBalloon: false,
        interactivityModel: 'default#silent',
        visible: this.arePolygonsVisible,
      });
    });
  }

  private placeMarkLogic(): void {
    this.yaMapService.map.events.add(
      'click',
      (e) => {
        const coords = e.get('coords');
        this.mapClick(coords);
      },
      this,
    );
  }

  private highlightResult(obj): void {
    let coords = obj.geometry.getCoordinates();
    const polygon = this.courtZones.searchContaining(coords).get(0);

    if (polygon) {
      this.selectMapObjectService.isNoDepartmentErrorVisible.next(false);
      const attributeValues = polygon.properties.get('attributeValues');
      const mapObj = {
        baloonContent: this.selectMapObjectService.getMappedAttrsForBaloon(
          this.selectMapObjectService.componentAttrs.baloonContent,
          { attributeValues } as DictionaryYMapItem,
        ),
        expanded: true,
        attributeValues,
        title: attributeValues.CourtName,
      };
      // EPGU-lib изначально настроена на порядок координат longlat. Справочник же возвращает их в latlong
      coords = JSON.parse(attributeValues.CourtAddr_Nav).reverse();
      const items = [
        {
          center: coords,
          obj: mapObj,
        },
      ];
      const mapOjbect = this.yandexMapService.prepareFeatureCollection(items);
      this.yandexMapService.objectManager.removeAll();
      this.yandexMapService.objectManager.add(mapOjbect);
      this.setBounds();
      // Необходимо сначала закрыть старый, чтобы не сработало логика при клике на новом "Повторый клик по пину отменяет выбор" (id одинаковые так как пин всегда один)
      this.yandexMapService.closeBalloon();
      this.yandexMapService.centeredPlaceMark(mapOjbect.features[0], false, false);

      this.courtZones.setOptions('fillOpacity', 0.25);
      polygon.options.set('fillOpacity', 0.75);
    } else {
      this.yandexMapService.setCenter(coords);
      this.yandexMapService.closeBalloon();
      this.yandexMapService.objectManager.removeAll();
      this.selectMapObjectService.isNoDepartmentErrorVisible.next(true);
      this.courtZones.setOptions('fillOpacity', 0.25);
    }
  }

  // Устанавливает границы карты таким образом, чтобы суд был по центру, а пин с адресом в углу
  private setBounds(): void {
    const point1 = this.myPlacemark.geometry.getCoordinates();
    const courtCoordinates = this.yandexMapService.objectManager.objects.getById(0).geometry
      .coordinates;
    const point2 = this.selectMapObjectService.getReflectionPoint(point1, courtCoordinates);
    const bounds = this.yandexMapService.getBoundsByCoords([point1, point2]);

    this.yaMapService.map.setBounds(bounds, { duration: 500 });
  }

  private preparePolygons(): void {
    const options = {
      filter: {
        union: {
          unionKind: DictionaryUnionKind.AND,
          subs: [
            {
              simple: {
                attributeName: 'CourtType',
                condition: DictionaryConditions.EQUALS,
                value: {
                  asDecimal: 1,
                },
              },
            },
          ],
        },
      },
    };
    this.dictionaryApiService.getGenericDictionary('SDRF_Courts', options).subscribe((response) => {
      this.drawPolygonsOnMap(this.prepareFeatureCollection(response));
      this.highlightResult(this.myPlacemark);
    });
  }

  private prepareFeatureCollection(response): IFeatureCollection<IFeatureItem<unknown>> {
    // Складываем все полигоны в одну FeatureCollection чтобы проводить все операции с полигонами через нее
    const featureCollection = {
      type: 'FeatureCollection',
      metadata: {
        name: 'delivery',
        creator: 'Yandex Map Constructor',
      },
      features: [],
    };
    response.items.forEach((item, index) => {
      const collection: IFeatureCollection<IFeatureItem<
        unknown
      >> = this.jsonHelperService.tryToParse(
        item.attributeValues.CourtJurisd_Nav,
      ) as IFeatureCollection<IFeatureItem<unknown>>;
      let feature;

      // Проверка на кривую кодировку
      if (item.attributeValues.CourtName.match(/[^\w\sа-яё\-№\.]/i)) {
        this.logError('WrongEncoding', item);
      }

      if (!collection) {
        this.logError('WreckedCourtJurisdNav', item);
      } else {
        if (Array.isArray(collection.features)) {
          collection.features = collection.features.filter((feat) => {
            // Исключаем ошибочные данные где вместо полигонов в данных просто точка
            return !feat.geometry.coordinates.some((coords) => !coords[0]);
          });

          if (collection.features.length) {
            [feature] = collection.features;
            feature.id = index;
            feature.properties = {
              attributeValues: item.attributeValues,
            };
            featureCollection.features.push(feature);
          }
        } else {
          this.logError('EmptyCourtJurisdNav', item);
        }
      }
    });

    return featureCollection;
  }

  private logError(courtErrorType: string, item): void {
    this.loggerService.log([
      `${courtErrorType} ${item.attributeValues.CourtID} ${item.attributeValues.CourtName}`,
    ]);
    this.health.measureStart('courtError');
    this.health.measureEnd('courtError', 1, {
      CourtID: item.attributeValues.CourtID,
      CourtName: item.attributeValues.CourtName,
      courtErrorType,
    });
  }
}
