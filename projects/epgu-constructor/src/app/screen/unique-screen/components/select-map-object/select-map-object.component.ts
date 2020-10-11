import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
  NgZone,
  OnDestroy,
} from '@angular/core';
import { switchMap, filter, takeUntil, reduce } from 'rxjs/operators';
import { of, merge } from 'rxjs';
import { YaMapService } from 'epgu-lib';

import { ConfigService } from '../../../../config/config.service';
import { SelectMapObjectService } from './select-map-object.service';
import { DictionaryApiService } from '../../../../services/api/dictionary-api/dictionary-api.service';
import { UnsubscribeService } from '../../../../services/unsubscribe/unsubscribe.service';
import { IGeoCoordsResponse, IdictionaryFilter } from './select-map-object.interface';
import { UtilsService } from '../../../../services/utils/utils.service';
import { DictionaryUtilities } from '../../../../shared/services/dictionary/dictionary-utilities-service';
import { ComponentBase, ScreenStore } from '../../../screen.types';
import { ScreenService } from '../../../screen.service';
import {
  DictionaryOptions,
  DictionaryYMapItem,
} from '../../../../services/api/dictionary-api/dictionary-api.types';
import { ModalService } from '../../../../services/modal/modal.service';
import { CommonModalComponent } from '../../../../shared/components/modal/common-modal/common-modal.component';

@Component({
  selector: 'epgu-constructor-select-map-object',
  templateUrl: './select-map-object.component.html',
  styleUrls: ['./select-map-object.component.scss'],
  providers: [UnsubscribeService],
})
export class SelectMapObjectComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() data: ComponentBase;
  @Input() applicantAnswers: { [key: string]: any };
  @Output() nextStepEvent = new EventEmitter<any>();

  @ViewChild('detailsTemplate', { static: false }) detailsTemplate;
  @ViewChild('informationTemplate', { static: false }) informationTemplate;

  public mappedDictionaryForLookup;
  public mapCenter: Array<number>;
  public mapControls = [];
  public provider = { search: this.providerSearch() };
  public selectedValue: any;
  public mapIsLoaded = false;
  public scrollConfig = { ressScrollX: true, wheelPropagation: false };

  private componentValue: any;
  private screenStore: ScreenStore;

  constructor(
    public selectMapObjectService: SelectMapObjectService,
    public config: ConfigService,
    private yaMapService: YaMapService,
    private dictionaryApiService: DictionaryApiService,
    private ngUnsubscribe$: UnsubscribeService,
    private screenService: ScreenService,
    private cdr: ChangeDetectorRef,
    private modalService: ModalService,
    private zone: NgZone,
  ) {}

  ngOnInit(): void {
    this.initVariable();
    this.subscribeToEmmitNextStepData();
  }

  ngAfterViewInit(): void {
    this.selectMapObjectService.templates.detailsTemplate = this.detailsTemplate;
    this.selectMapObjectService.templates.informationTemplate = this.informationTemplate;
  }

  ngOnDestroy(): void {
    this.yaMapService.mapSubject.next(null);
    this.selectMapObjectService.mapOpenedBalloonId = null;
  }

  private initVariable() {
    this.initComponentAttrs();
    this.controlsLogicInit();
  }

  private initComponentAttrs(): void {
    this.selectMapObjectService.componentAttrs = this.data.attrs;
    this.componentValue = JSON.parse(this.data?.value || '{}');
    this.screenStore = this.screenService.getStore();
  }

  private initSelectedValue() {
    if (this.data?.value && this.data?.value !== '{}') {
      const mapObject = JSON.parse(this.data?.value);
      this.selectMapObjectService.centeredPlaceMark(mapObject.center, mapObject.id);
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
    this.selectMapObjectService.selectedValue
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((value: any) => {
        this.selectedValue = value;
        this.cdr.detectChanges();
      });
  }

  private controlsLogicInit() {
    this.yaMapService.mapSubject
      .pipe(
        filter((yMap) => yMap),
        takeUntil(this.ngUnsubscribe$),
      )
      .subscribe(() => {
        this.initMap();
      });
    this.tryInitMapCenter();
  }

  /**
   * Инициализация карты - попытка определения центра, получение и расстановка точек на карте
   */
  private initMap() {
    this.setMapOpstions();
    this.fillCoords(this.selectMapObjectService.componentAttrs.dictionaryFilter).subscribe(
      (coords: IGeoCoordsResponse) => {
        this.handleFilledCoordinate(coords);
        this.mapIsLoaded = true;
        this.initSelectedValue();
        this.cdr.detectChanges();
      },
    );
  }

  private setMapOpstions() {
    this.selectMapObjectService.ymaps = (window as any).ymaps;
    this.yaMapService.map.controls.add('zoomControl', {
      position: {
        top: 108,
        right: 10,
        bottom: 'auto',
        left: 'auto',
      },
    });
    this.yaMapService.map.copyrights.togglePromo();
  }

  /**
   * Обработка полученных координат - сохранение в массиве сервиса, расстановка на карте
   * @param coords ответ с бэка с координатами точек
   */
  private handleFilledCoordinate(coords: IGeoCoordsResponse) {
    this.selectMapObjectService.saveCoords(coords);
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
    } else {
      this.mapCenter = this.componentValue.center || [37.64, 55.76]; // Москва
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
      .getSelectMapDictionary(this.getDictionaryType(), this.getOptions(dictionaryFilters))
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
  private getOptions(dictionaryFilters: Array<IdictionaryFilter>): DictionaryOptions {
    return {
      ...DictionaryUtilities.getFilterOptions(
        this.componentValue,
        this.screenStore,
        dictionaryFilters,
      ),
      selectAttributes: ['*'],
      pageSize: '10000',
    };
  }

  private getDictionaryType() {
    return this.selectMapObjectService.componentAttrs.dictionaryType;
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
        DictionaryUtilities.adaptDictionaryForLookupForSelectMap(
          this.selectMapObjectService.filteredDictionaryItems,
        ),
      );
    };
  }

  public selectObject() {
    this.zone.run(() => {
      const answer = { ...this.selectedValue, children: null };
      this.nextStepEvent.emit(JSON.stringify(answer));
    });
  }

  /**
   * Показывает модальное окно на основе шаблона
   * @param templateName имя шаблона из this.templates
   * @param item контекст балуна
   */
  public showModalFromTemplate(templateName, item) {
    this.modalService.openModal(CommonModalComponent, {
      modalTemplateRef: this[templateName],
      item,
    });
  }

  /**
   * Метод раскрывает выбранный зал на панели слева
   * @param mapObject объект на карте
   */
  public expandObject(mapObject: DictionaryYMapItem): void {
    if (mapObject.expanded) return;
    this.selectedValue.children = this.selectedValue.children.map((child: DictionaryYMapItem) => {
      return { ...child, expanded: child.id === mapObject.id };
    });
  }
}
