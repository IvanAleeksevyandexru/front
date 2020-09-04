import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { YaMapService } from 'epgu-lib';
import { interval } from 'rxjs';
import { filter, switchMap, takeUntil, takeWhile } from 'rxjs/operators';
import { DisplayInterface } from '../../../../services/api/form-player-api/form-player-api.types';
import { ConfigService } from '../../../../config/config.service';
import { DictionaryApiService } from '../../../../services/api/dictionary-api/dictionary-api.service';
import { UnsubscribeService } from '../../../../services/unsubscribe/unsubscribe.service';
import { IGeoCoordsResponse } from './select-map-object.interface';
import { SelectMapObjectService } from './select-map-object.service';

@Component({
  selector: 'epgu-constructor-select-map-object',
  templateUrl: './select-map-object.component.html',
  styleUrls: ['./select-map-object.component.scss'],
  providers: [UnsubscribeService],
})
export class SelectMapObjectComponent implements OnInit {
  @Input() data: DisplayInterface;
  @Output() nextStepEvent = new EventEmitter<any>();

  public mappedDictionaryForLookup;
  public mapCenter: Array<number>;
  public mapControls = ['zoomControl'];
  public yandexMapsApiKey: string;

  private isMapsScriptLoaded = false;
  private regCode: string;
  private componentValue;

  constructor(
    public selectMapObjectService: SelectMapObjectService,
    private yaMapService: YaMapService,
    private dictionaryApiService: DictionaryApiService,
    private configService: ConfigService,
    private ngUnsubscribe$: UnsubscribeService,
  ) {
    this.yandexMapsApiKey = this.configService.config.yandexMapsApiKey;
  }

  ngOnInit(): void {
    if (this.data.components[0].value) {
      this.componentValue = JSON.parse(this.data.components[0].value);
      this.regCode = this.componentValue.regCode;
    }
    this.controlsLogicInit();
    this.selectMapObjectService.controlValue
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((value: any) => this.nextStepEvent.emit(JSON.stringify(value)));
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
        this.mapCenter = [this.componentValue.geo_lon, this.componentValue.geo_lat];
        this.fillCoords(this.regCode).subscribe((coords: IGeoCoordsResponse) => {
          this.saveCoords(coords);
          this.selectMapObjectService.placeOjectsOnMap(this.yaMapService.map);
        });
      });
  }

  /**
   * По фиас получаем кладр, по кладру справочник с объектами на карте, по адресам объектов список координат
   * затем заполняем полученный справочник этими координтами и кладем в сервис
   * @param regCode код региона
   */
  private fillCoords(regCode) {
    return this.dictionaryApiService
      .getDictionary(
        // TODO получить имя из response
        'FNS_ZAGS_ORGANIZATION_AREA',
        this.getFilterOptions(regCode),
      )
      .pipe(
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

  // TODO Сделать интерфейс для mapObject
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
                value: { asString: `${kladr || 'R77'}` },
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
