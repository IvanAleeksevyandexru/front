import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { switchMap, filter, takeWhile, takeUntil } from 'rxjs/operators';

import { YaMapService } from 'epgu-lib';
import { interval, Observable } from 'rxjs';
import { SelectMapObjectService } from './select-map-object.service';
import { EgpuResponseInterface } from '../../../../../interfaces/epgu.service.interface';
import { RestService } from '../../../../services/rest/rest.service';
import { ConstructorConfigService } from '../../../../services/config/constructor-config.service';
import { UnsubscribeService } from '../../../../services/unsubscribe/unsubscribe.service';
import { IGeoCoordsResponse } from './select-map-object.interface';

@Component({
  selector: 'app-select-map-object',
  templateUrl: './select-map-object.component.html',
  styleUrls: ['./select-map-object.component.scss'],
  providers: [UnsubscribeService],
})
export class SelectMapObjectComponent implements OnInit {
  @Input() data: EgpuResponseInterface;
  @Output() nextStepEvent = new EventEmitter<any>();

  public mappedDictionaryForLookup;
  public mapCenter: Array<number>;
  public mapControls = ['zoomControl'];
  public yandexMapsApiKey: string;

  private isMapsScriptLoaded = false;
  private fiasCode;

  constructor(
    public selectMapObjectService: SelectMapObjectService,
    private yaMapService: YaMapService,
    private restService: RestService,
    private constructorConfigService: ConstructorConfigService,
    private ngUnsubscribe$: UnsubscribeService,
  ) {
    this.yandexMapsApiKey = constructorConfigService.config.yandexMapsApiKey;
    // TODO HARDCODE
    this.fiasCode =
      // constructorService.response.applicantAnswers?.pd1?.value
      '0c5b2444-70a0-4932-980c-b4dc0d3f02b5';
  }

  ngOnInit(): void {
    this.controlsLogicInit();
    this.selectMapObjectService.controlValue
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((value: any) => this.nextStepEvent.emit(value));
  }

  private controlsLogicInit() {
    interval(1000)
      .pipe(
        filter(() => this.yaMapService.map),
        takeWhile(() => !this.isMapsScriptLoaded),
      )
      .subscribe(() => {
        this.selectMapObjectService.ymaps = (window as any).ymaps;
        this.isMapsScriptLoaded = true; // флаг чтобы отписаться
        this.fillCoords(this.fiasCode).subscribe((coords: IGeoCoordsResponse) => {
          this.saveCoords(coords);
          this.selectMapObjectService.placeOjectsOnMap(this.yaMapService.map);
        });
      });
  }

  /**
   * По фиас получаем кладр, по кладру справочник с объектами на карте, по адресам объектов список координат
   * затем заполняем полученный справочник этими координтами и кладем в сервис
   * @param fiasCode код фиас
   */
  private fillCoords(fiasCode): Observable<IGeoCoordsResponse> {
    return this.restService.getDadataByFias(fiasCode).pipe(
      switchMap((geoObject: any) => {
        const kladrCodeFirst2Letters = geoObject.address.elements[0].kladrCode.substr(0, 2);
        this.mapCenter = [geoObject.geo_lon, geoObject.geo_lat];
        return this.restService.getDictionary(
          // TODO получить имя из response
          'FNS_ZAGS_ORGANIZATION_AREA',
          this.getFilterOptions(kladrCodeFirst2Letters),
        );
      }),
      switchMap((dictionary: any) => {
        this.selectMapObjectService.dictionary = dictionary;
        this.mappedDictionaryForLookup = this.mapDictionaryForLookup(dictionary);
        return this.selectMapObjectService.getCoordsByAddress(dictionary.items);
      }),
    );
  }

  /**
   * Заполняет словарь в сервисе полученными координатами
   * @param coords массив гео координат для объектов
   */
  private saveCoords(coords: IGeoCoordsResponse) {
    this.selectMapObjectService.filteredDictionaryItems =
      this.selectMapObjectService.dictionary.items || [];
    this.selectMapObjectService.fillDictionaryItemsWithCoords(coords);
  }

  private mapDictionaryForLookup(dictionary) {
    return dictionary.items.map((item) => {
      return {
        originalItem: item,
        id: item.value,
        text: item.title,
      };
    });
  }

  public search(searchString) {
    this.selectMapObjectService.searchMapObject(searchString);
  }

  public selectMapObject(mapObject) {
    this.selectMapObjectService.centeredPlaceMark(mapObject.center, mapObject.id);
  }

  /**
   * prepares options for dictionary
   * @param kladr
   */
  private getFilterOptions(kladr) {
    return {
      filter: {
        union: {
          unionKind: 'AND',
          subs: [
            {
              simple: {
                attributeName: 'SHOW_ON_MAP',
                condition: 'EQUALS',
                value: { asString: 'true' },
              },
            },
            {
              simple: {
                attributeName: 'CODE',
                condition: 'CONTAINS',
                value: { asString: `R${kladr || '77'}` },
              },
            },
            {
              simple: {
                attributeName: 'PR2',
                condition: 'EQUALS',
                value: { asString: 'true' },
              },
            },
          ],
        },
      },
    };
  }
}
