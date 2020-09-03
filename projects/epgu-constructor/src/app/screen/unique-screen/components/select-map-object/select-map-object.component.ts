import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { switchMap, filter, takeWhile, takeUntil, tap, reduce } from 'rxjs/operators';

import { YaMapService } from 'epgu-lib';
import { interval, of, merge } from 'rxjs';
import { SelectMapObjectService } from './select-map-object.service';
import { ConstructorConfigService } from '../../../../services/config/constructor-config.service';
import { DictionaryApiService } from '../../../../services/api/dictionary-api/dictionary-api.service';
import { UnsubscribeService } from '../../../../services/unsubscribe/unsubscribe.service';
import { IGeoCoordsResponse, IdictionaryFilter } from './select-map-object.interface';
import { ComponentInterface } from '../../../../../interfaces/epgu.service.interface';
import { UtilsService } from '../../../../services/utils/utils.service';

@Component({
  selector: 'epgu-constructor-select-map-object',
  templateUrl: './select-map-object.component.html',
  styleUrls: ['./select-map-object.component.scss'],
  providers: [UnsubscribeService],
})
export class SelectMapObjectComponent implements OnInit, AfterViewInit {
  @Input() data: ComponentInterface;
  @Input() applicantAnswers: { [key: string]: any };
  @Output() nextStepEvent = new EventEmitter<any>();

  @ViewChild('detailsTemplate', { static: false }) detailsTemplate;
  @ViewChild('informationTemplate', { static: false }) informationTemplate;

  public mappedDictionaryForLookup;
  public mapCenter: Array<number>;
  public mapControls = ['zoomControl'];
  public yandexMapsApiKey: string;
  public provider = { search: this.providerSearch() };

  private componentValue: any;
  private selectedValue: any;
  private selectedValueField: any;

  constructor(
    public selectMapObjectService: SelectMapObjectService,
    private yaMapService: YaMapService,
    private dictionaryApiService: DictionaryApiService,
    private constructorConfigService: ConstructorConfigService,
    private ngUnsubscribe$: UnsubscribeService,
  ) {
    this.yandexMapsApiKey = this.constructorConfigService.config.yandexMapsApiKey;
  }

  ngOnInit(): void {
    this.selectMapObjectService.componentAttrs = this.data.attrs;
    this.componentValue = {};
    if (this.data.value) {
      this.componentValue = JSON.parse(this.data.value);
      if (this.data.attrs.selectedValue) {
        this.selectedValue = UtilsService.getObjectProperty(
          this.applicantAnswers,
          this.data.attrs.selectedValue.value,
        );
        // Если в JSON есть selectedValue то выбираем этот элемент на карте
        this.selectedValue = JSON.parse(this.selectedValue);
        this.selectedValueField = this.data.attrs.selectedValueMapping?.value;
      }
    }
    this.controlsLogicInit();
    this.selectMapObjectService.controlValue
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((value: any) => this.nextStepEvent.emit(JSON.stringify(value)));
  }

  ngAfterViewInit(): void {
    this.selectMapObjectService.templates.detailsTemplate = this.detailsTemplate;
    this.selectMapObjectService.templates.informationTemplate = this.informationTemplate;
  }

  private controlsLogicInit() {
    interval(50)
      .pipe(
        filter(() => this.yaMapService.map),
        tap(() => {
          this.selectMapObjectService.ymaps = (window as any).ymaps;
          if (this.componentValue.geo_lon && this.componentValue.geo_lat) {
            this.mapCenter = [this.componentValue.geo_lon, this.componentValue.geo_lat];
          }
          this.fillCoords(this.selectMapObjectService.componentAttrs.dictionaryFilter).subscribe(
            (coords: IGeoCoordsResponse) => {
              this.saveCoords(coords);
              this.selectMapObjectService.placeOjectsOnMap(this.yaMapService.map);
              if (this.selectedValue) {
                const selectedObject = this.selectMapObjectService.findObjectByValue(
                  this.selectedValue.value,
                );
                this.selectMapObject(selectedObject);
              }
            },
          );
        }),
        takeWhile(() => !this.yaMapService.map),
      )
      .subscribe();
  }

  /**
   * настройки для справочника объектов на карте и фильтров берем из атрибутов компонента с бэка
   * затем по адресам объектов получаем список координат
   * затем заполняем полученный справочник этими координтами и кладем в сервис
   * @param dictionaryFilters фильтры из атрибутов компонента
   */
  private fillCoords(dictionaryFilters) {
    return this.dictionaryApiService
      .getDictionary(this.selectMapObjectService.componentAttrs.dictionaryType, {
        ...this.getFilterOptions(dictionaryFilters),
        // selectAttributes: ['ZAGS_NAME', 'ADDRESS', 'PHONE', 'EMAIL', 'GET_CONSENT', 'AREA_DESCR'],
        // TODO add fields to JSON
        selectAttributes: ['*'],
      })
      .pipe(
        switchMap((dictionary: any) => {
          this.selectMapObjectService.dictionary = dictionary;
          // this.mappedDictionaryForLookup = this.mapDictionaryForLookup(dictionary);
          const items = [...dictionary.items];
          // Параллелим получение геоточек на 4 запроса
          return merge(
            this.selectMapObjectService.getCoordsByAddress(
              items.splice(0, Math.ceil(dictionary.items.length / 4)),
            ),
            this.selectMapObjectService.getCoordsByAddress(
              items.splice(0, Math.ceil(dictionary.items.length / 4)),
            ),
            this.selectMapObjectService.getCoordsByAddress(
              items.splice(0, Math.ceil(dictionary.items.length / 4)),
            ),
            this.selectMapObjectService.getCoordsByAddress(
              items.splice(0, Math.ceil(dictionary.items.length / 4)),
            ),
          ).pipe(
            reduce((acc, val) => {
              acc.coords = acc.coords.concat(val.coords);
              return acc;
            }),
          );
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

  private mapDictionaryForLookup(dictionaryItems) {
    return dictionaryItems.map((item) => {
      return {
        originalItem: item,
        id: item.value,
        text: item.title,
      };
    });
  }

  // TODO Сделать интерфейс для mapObject
  private selectMapObject(mapObject) {
    if (!mapObject) return;
    this.selectMapObjectService.centeredPlaceMark(mapObject.center, mapObject.id);
  }

  public lookupChanged(mapObject, lookup) {
    this.selectMapObject(mapObject);
    lookup.clearInput();
  }

  /**
   * prepares options for dictionary
   * @param dictionaryFilters фильтры из атрибутов компонента
   */
  private getFilterOptions(dictionaryFilters?: Array<IdictionaryFilter>) {
    const filters = dictionaryFilters.map((dFilter) => {
      let filterValue;
      if (dFilter.valueType === 'value') {
        filterValue = JSON.parse(dFilter.value);
      } else if (dFilter.valueType === 'preset') {
        filterValue = { asString: this.componentValue[dFilter.value] };
      }
      return {
        simple: {
          attributeName: dFilter.attributeName,
          condition: dFilter.condition,
          value: filterValue,
        },
      };
    });
    return {
      filter: {
        union: {
          unionKind: 'AND',
          subs: filters,
        },
      },
    };
  }

  public providerSearch(): Function {
    return (searchString) => {
      this.selectMapObjectService.searchMapObject(searchString);
      return of(this.mapDictionaryForLookup(this.selectMapObjectService.filteredDictionaryItems));
    };
  }
}
