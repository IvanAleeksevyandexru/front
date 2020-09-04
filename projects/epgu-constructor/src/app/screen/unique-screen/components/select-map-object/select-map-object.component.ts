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
import { IGeoCoordsResponse } from './select-map-object.interface';
import { ComponentInterface } from '../../../../../interfaces/epgu.service.interface';
import { UtilsService } from '../../../../services/utils/utils.service';
import { Utilities } from './utilities';

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
    this.initVariable();
    this.subscribeToEmmitNextStepData();
  }

  ngAfterViewInit(): void {
    this.selectMapObjectService.templates.detailsTemplate = this.detailsTemplate;
    this.selectMapObjectService.templates.informationTemplate = this.informationTemplate;
  }

  private initVariable() {
    this.initComponentAttrs();
    this.initComponentValue();
    this.initSelectedValue();
    this.controlsLogicInit();
  }

  initComponentAttrs() {
    this.selectMapObjectService.componentAttrs = this.data.attrs;
  }

  private initComponentValue() {
    this.componentValue = JSON.parse(this.data?.value || '{}');
  }

  private initSelectedValue() {
    if (this.data?.value && this.data?.attrs?.selectedValue) {
      this.selectedValue = this.getSelectedValue();
      this.selectedValueField = this.data.attrs.selectedValueMapping?.value;
    }
  }

  private getSelectedValue() {
    const selectedValue = UtilsService.getObjectProperty(
      this.applicantAnswers,
      this.data.attrs.selectedValue.value,
    );
    return JSON.parse(selectedValue);
  }

  private subscribeToEmmitNextStepData() {
    this.selectMapObjectService.controlValue
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((value: any) => this.nextStepEvent.emit(JSON.stringify(value)));
  }

  private controlsLogicInit() {
    interval(200)
      .pipe(
        filter(() => this.yaMapService.map),
        tap(() => this.initMap()),
        takeWhile(() => !this.yaMapService.map),
      )
      .subscribe();
  }

  /**
   * Инициализация карты - попытка определения центра, получение и расстановка точек на карте
   */
  private initMap() {
    this.tryInitMapCenter();
    this.selectMapObjectService.ymaps = (window as any).ymaps;
    this.fillCoords(
      this.selectMapObjectService.componentAttrs.dictionaryFilter,
    ).subscribe((coords: IGeoCoordsResponse) => this.handleFilledCoordinate(coords));
  }

  /**
   * Обработка полученных координат - сохранение в массиве сервиса, расстановка на карте
   * @param coords ответ с бэка с координатами точек
   */
  private handleFilledCoordinate(coords: IGeoCoordsResponse) {
    this.saveCoords(coords);
    this.selectMapObjectService.placeOjectsOnMap(this.yaMapService.map);
    this.tryInitSelectedObject();
  }

  private tryInitSelectedObject() {
    if (this.selectedValue) {
      this.selectMapObject(this.getSelectedObject());
    }
  }

  private getSelectedObject() {
    return this.selectMapObjectService.findObjectByValue(this.selectedValue.value);
  }

  /**
   * Функция пытается инициализировать центр карты
   */
  private tryInitMapCenter() {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { geo_lon, geo_lat } = this.componentValue;
    if (geo_lon && geo_lat) {
      this.mapCenter = [geo_lon, geo_lat];
    }
  }

  /**
   * настройки для справочника объектов на карте и фильтров берем из атрибутов компонента с бэка
   * затем по адресам объектов получаем список координат
   * затем заполняем полученный справочник этими координтами и кладем в сервис
   * @param dictionaryFilters фильтры из атрибутов компонента
   */
  private fillCoords(dictionaryFilters) {
    return this.dictionaryApiService
      .getDictionary(this.getDictionaryType(), this.getOptions(dictionaryFilters))
      .pipe(
        switchMap((dictionary: any) => {
          this.selectMapObjectService.dictionary = dictionary;
          // Параллелим получение геоточек на 4 запроса
          const items = [...dictionary.items];
          const chunkSize = items.length / 4;
          return merge(
            this.selectMapObjectService.getCoordsByAddress(items.splice(0, chunkSize)),
            this.selectMapObjectService.getCoordsByAddress(items.splice(0, chunkSize)),
            this.selectMapObjectService.getCoordsByAddress(items.splice(0, chunkSize)),
            this.selectMapObjectService.getCoordsByAddress(items),
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
   * Подготовка тела POST запроса dictionary
   * @param dictionaryFilters фильтры из атрибутов компонента
   */
  private getOptions(dictionaryFilters) {
    return {
      ...Utilities.getFilterOptions(this.componentValue, dictionaryFilters),
      // selectAttributes: ['ZAGS_NAME', 'ADDRESS', 'PHONE', 'EMAIL', 'GET_CONSENT', 'AREA_DESCR'],
      // TODO add fields to JSON
      selectAttributes: ['*'],
    };
  }

  private getDictionaryType() {
    return this.selectMapObjectService.componentAttrs.dictionaryType;
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

  // TODO Сделать интерфейс для mapObject
  private selectMapObject(mapObject) {
    if (!mapObject) return;
    this.selectMapObjectService.centeredPlaceMark(mapObject.center, mapObject.id);
  }

  public lookupChanged(mapObject, lookup) {
    this.selectMapObject(mapObject);
    lookup.clearInput();
  }

  public providerSearch(): Function {
    return (searchString) => {
      this.selectMapObjectService.searchMapObject(searchString);
      return of(
        Utilities.adaptDictionaryForLookupForSelectMap(
          this.selectMapObjectService.filteredDictionaryItems,
        ),
      );
    };
  }
}
