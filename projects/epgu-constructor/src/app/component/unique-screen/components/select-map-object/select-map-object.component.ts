import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { YaMapService } from 'epgu-lib';
import { ListElement, LookupProvider } from 'epgu-lib/lib/models/dropdown.model';
import { merge, Observable, of } from 'rxjs';
import { filter, map, reduce, switchMap, takeUntil } from 'rxjs/operators';
import { ConfigService } from '../../../../core/config/config.service';
import { DeviceDetectorService } from '../../../../core/services/device-detector/device-detector.service';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';
import { ConfirmationModalComponent } from '../../../../modal/confirmation-modal/confirmation-modal.component';
import { ModalService } from '../../../../modal/modal.service';
import { CommonModalComponent } from '../../../../modal/shared/common-modal/common-modal.component';
import { ScreenService } from '../../../../screen/screen.service';
import { ComponentBase, ScreenStore } from '../../../../screen/screen.types';
import { UtilsService } from '../../../../core/services/utils/utils.service';
import { DictionaryApiService } from '../../../shared/services/dictionary-api/dictionary-api.service';
import {
  ComponentValue,
  DictionaryUtilities,
} from '../../../../shared/services/dictionary/dictionary-utilities-service';
import {
  DictionaryOptions,
  DictionaryResponseForYMap,
  DictionaryYMapItem,
} from '../../../shared/services/dictionary-api/dictionary-api.types';
import { getPaymentRequestOptionGIBDD } from './select-map-object.helpers';
import { IdictionaryFilter, IGeoCoordsResponse } from './select-map-object.interface';
import { SelectMapComponentAttrs, SelectMapObjectService } from './select-map-object.service';
import { ApplicantAnswersDto } from '../../../../form-player/services/form-player-api/form-player-api.types';
import { ConstructorLookupComponent } from '../../../../shared/components/constructor-lookup/constructor-lookup.component';

@Component({
  selector: 'epgu-constructor-select-map-object',
  templateUrl: './select-map-object.component.html',
  styleUrls: ['./select-map-object.component.scss'],
  providers: [UnsubscribeService, SelectMapObjectService],
})
export class SelectMapObjectComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() data: ComponentBase;
  @Input() applicantAnswers: ApplicantAnswersDto;
  @Output() nextStepEvent = new EventEmitter<string>();

  @ViewChild('detailsTemplate', { static: false }) detailsTemplate;
  @ViewChild('informationTemplate', { static: false }) informationTemplate;

  public mappedDictionaryForLookup;
  public mapCenter: Array<number>;
  public mapControls = [];
  public provider: LookupProvider<Partial<ListElement>> = { search: this.providerSearch() };
  public selectedValue;
  public showMap = false;
  public mapIsLoaded = false;
  public scrollConfig = { suppressScrollX: true, wheelPropagation: false };
  public isMobile: boolean;
  public isSearchTitleVisible = true;

  private componentValue: ComponentValue;
  private screenStore: ScreenStore;
  private needToAutoFocus = false; // Флаг из атрибутов для авто центровки ближайшего объекта к центру

  constructor(
    public selectMapObjectService: SelectMapObjectService,
    public config: ConfigService,
    private yaMapService: YaMapService,
    private dictionaryApiService: DictionaryApiService,
    private ngUnsubscribe$: UnsubscribeService,
    public screenService: ScreenService,
    private cdr: ChangeDetectorRef,
    private modalService: ModalService,
    private zone: NgZone,
    private deviceDetector: DeviceDetectorService,
  ) {
    this.isMobile = this.deviceDetector.isMobile;
  }

  ngOnInit(): void {
    this.initVariable();
    this.subscribeToEmmitNextStepData();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.showMap = true;
    });
    this.selectMapObjectService.templates.detailsTemplate = this.detailsTemplate;
    this.selectMapObjectService.templates.informationTemplate = this.informationTemplate;
  }

  ngOnDestroy(): void {
    this.clearMapVariables();
  }

  private initVariable(): void {
    this.initComponentAttrs();
    this.controlsLogicInit();
  }

  private initComponentAttrs(): void {
    this.selectMapObjectService.componentAttrs = this.data.attrs as SelectMapComponentAttrs;
    this.needToAutoFocus = this.data.attrs.autoMapFocus;
    this.componentValue = JSON.parse(this.data?.value || '{}');
    this.screenStore = this.screenService.getStore();
  }

  private initSelectedValue(): void {
    if (this.data?.value && this.data?.value !== '{}') {
      const mapObject = JSON.parse(this.data?.value);
      // Если есть idForMap (из cachedAnswers) то берем его, иначе пытаемся использовать из attrs.selectedValue
      if (mapObject.idForMap) {
        this.selectMapObjectService.centeredPlaceMark(mapObject.center, mapObject.idForMap);
      } else if (this.data?.attrs.selectedValue) {
        const selectedValue = this.getSelectedValue();
        this.selectMapObjectService.centeredPlaceMarkByObjectValue(selectedValue.id);
      } else if (this.needToAutoFocus) {
        this.selectClosestMapObject();
      }
    }
  }

  /**
   * Получаем выбранный ЗАГС из applicantAnswers по пути из attrs.selectedValue
   */
  private getSelectedValue(): { [key: string]: string } {
    const selectedValue = UtilsService.getObjectProperty(
      this.applicantAnswers,
      this.data?.attrs.selectedValue,
    );
    return JSON.parse(selectedValue);
  }

  private subscribeToEmmitNextStepData(): void {
    this.selectMapObjectService.selectedValue
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((value) => {
        this.isSearchTitleVisible = !value || !this.isMobile;
        this.selectedValue = value;
        this.cdr.detectChanges();
      });
  }

  private controlsLogicInit(): void {
    this.yaMapService.mapSubject
      .pipe(
        filter((yMap) => yMap),
        takeUntil(this.ngUnsubscribe$),
      )
      .subscribe(() => {
        this.initMap();
      });
    this.initMapCenter();
  }

  /**
   * Инициализация карты - попытка определения центра, получение и расстановка точек на карте
   */
  private initMap(): void {
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

  private setMapOpstions(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.selectMapObjectService.ymaps = (window as any).ymaps;
    this.yaMapService.map.controls.add('zoomControl', {
      position: {
        top: 108,
        right: 10,
        bottom: 'auto',
        left: 'auto',
      },
      size: this.isMobile ? 'small' : 'large',
    });
    this.yaMapService.map.options.set('minZoom', 4);
    this.yaMapService.map.copyrights.togglePromo();
  }

  /**
   * Обработка полученных координат - сохранение в массиве сервиса, расстановка на карте
   * @param coords ответ с бэка с координатами точек
   */
  private handleFilledCoordinate(coords: IGeoCoordsResponse): void {
    this.selectMapObjectService.saveCoords(coords);
    this.selectMapObjectService.placeOjectsOnMap(this.yaMapService.map);
    this.tryInitSelectedObject();
  }

  private tryInitSelectedObject(): void {
    if (this.selectedValue) {
      this.selectMapObject(this.getSelectedObject());
    }
  }

  private getSelectedObject(): DictionaryYMapItem {
    return this.selectMapObjectService.findObjectByValue(this.selectedValue.value);
  }

  /**
   * Функция инициализирует центр карты
   */
  private initMapCenter(): void {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { geo_lon, geo_lat, center } = this.componentValue;
    const moscowCenter = [37.64, 55.76]; // Москва
    const geoCode = geo_lon && geo_lat ? [geo_lon, geo_lat] : null;
    this.mapCenter = (geoCode || center || moscowCenter) as number[]; // TODO fix as
  }

  /**
   * настройки для справочника объектов на карте и фильтров берем из атрибутов компонента с бэка
   * затем по адресам объектов получаем список координат
   * затем заполняем полученный справочник этими координтами и кладем в сервис
   * @param dictionaryFilters фильтры из атрибутов компонента
   */
  private fillCoords(dictionaryFilters: Array<IdictionaryFilter>): Observable<IGeoCoordsResponse> {
    return this.dictionaryApiService
      .getSelectMapDictionary(this.getDictionaryType(), this.getOptions(dictionaryFilters))
      .pipe(
        switchMap((dictionary: DictionaryResponseForYMap) => {
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

  private getDictionaryType(): string {
    return this.selectMapObjectService.componentAttrs.dictionaryType;
  }

  private selectMapObject(mapObject: DictionaryYMapItem): void {
    if (!mapObject) return;
    this.selectMapObjectService.centeredPlaceMark(mapObject.center, mapObject.idForMap);
  }

  public lookupChanged(mapObject: DictionaryYMapItem, lookup: ConstructorLookupComponent): void {
    this.selectMapObject(mapObject);
    lookup.clearInput();
  }

  public providerSearch(): (val: string) => Observable<Partial<ListElement>[]> {
    return (searchString): Observable<Partial<ListElement>[]> => {
      this.selectMapObjectService.searchMapObject(searchString);
      return of(
        DictionaryUtilities.adaptDictionaryToListItem(
          this.selectMapObjectService.filteredDictionaryItems,
        ),
      );
    };
  }

  public selectObject(): void {
    if (this.selectedValue && this.screenService.component.attrs.isNeedToCheckGIBDDPayment) {
      this.availablePaymentInGIBDD(this.selectedValue.attributeValues.code)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(() => this.nextStep());
      return;
    }

    this.nextStep();
  }

  private nextStep(): void {
    this.zone.run(() => {
      const answer = {
        ...this.selectedValue,
        children: null,
        regOkato: this.componentValue?.regOkato,
        okato: this.componentValue?.okato,
      };
      this.nextStepEvent.emit(JSON.stringify(answer));
    });
  }

  /**
   * Показывает модальное окно на основе шаблона
   * @param templateName имя шаблона из this.templates
   * @param item контекст балуна
   */
  public showModalFromTemplate(templateName: string, item: DictionaryYMapItem): void {
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
      return { ...child, expanded: child.idForMap === mapObject.idForMap };
    });
  }

  private clearMapVariables(): void {
    // Необходимо очистить behaviorSubject чтобы при следующей подписке он не стрельнул 2 раза (текущее значение и новое при создание карты)
    this.yaMapService.mapSubject.next(null);
    // Очищаем id выбранной ранее точки чтобы при возврате на карту он был пуст.
    this.selectMapObjectService.mapOpenedBalloonId = null;
  }

  /**
   * Метод проверяет доступность оплаты в выбранном отделе ГИБДД
   * @param id объект на карте
   */
  private availablePaymentInGIBDD(id: number): Observable<boolean> {
    const options = getPaymentRequestOptionGIBDD(id);

    return this.dictionaryApiService
      .getDictionary(this.screenService.component.attrs.dictionaryGIBDD, options)
      .pipe(
        map((response) => {
          const hasAttributeValues = (): boolean =>
            response.items.every((item) =>
              this.screenService.component.attrs.checkedParametersGIBDD.every(
                (param) => item.attributeValues[param],
              ),
            );

          return !!response.items.length && hasAttributeValues();
        }),
        switchMap((hasPayment) => {
          if (hasPayment) {
            return of(true);
          }

          const { GIBDDpaymentError } = this.screenService.component.attrs;

          return this.modalService.openModal(ConfirmationModalComponent, {
            title: GIBDDpaymentError.title,
            text: GIBDDpaymentError.text,
            showCloseButton: false,
            showCrossButton: true,
            buttons: GIBDDpaymentError.buttons,
          });
        }),
        filter((isNextStep: boolean) => isNextStep),
      );
  }

  /**
   * Метод ищет и выбирает среди всех объектов ближайший к this.mapCenter
   */
  private selectClosestMapObject(): void {
    let minDistance = 9999999;
    let chosenMapObject;
    this.selectMapObjectService.filteredDictionaryItems.forEach((mapObj) => {
      // Находим катеты вычитая координаты X и Y центра карты из координат объектов на карте
      const cathetusX = this.mapCenter[0] - mapObj.center[0];
      const cathetusY = this.mapCenter[1] - mapObj.center[1];
      const distance = Math.sqrt(cathetusX * cathetusX + cathetusY * cathetusY);
      if (distance < minDistance) {
        minDistance = distance;
        chosenMapObject = mapObj;
      }
    });
    this.selectMapObjectService.centeredPlaceMark(chosenMapObject.center, chosenMapObject.idForMap);
  }
}
