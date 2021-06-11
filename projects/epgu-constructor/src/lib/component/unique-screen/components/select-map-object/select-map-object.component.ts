import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { YaMapService, ListElement, LookupProvider } from '@epgu/epgu-lib';
import { combineLatest, merge, Observable, of, throwError } from 'rxjs';
import { catchError, filter, map, reduce, switchMap, takeUntil, tap } from 'rxjs/operators';
import { isEqual as _isEqual } from 'lodash';
import {
  ActionType,
  ApplicantAnswersDto,
  ComponentDictionaryFilterDto,
  DictionaryOptions,
  IMvdFilter,
  ScreenButton,
  DictionaryFilterPriority,
} from '@epgu/epgu-constructor-types';
import {
  ConstructorLookupComponent,
  ModalService,
  CommonModalComponent,
  DeviceDetectorService,
  UnsubscribeService,
  ConfigService,
  UtilsService,
} from '@epgu/epgu-constructor-ui-kit';

import { ScreenService } from '../../../../screen/screen.service';
import { ComponentBase, ScreenStore } from '../../../../screen/screen.types';
import { DictionaryApiService } from '../../../../shared/services/dictionary/dictionary-api.service';
import {
  DictionaryResponseForYMap,
  DictionaryYMapItem,
} from '../../../../shared/services/dictionary/dictionary-api.types';
import {
  ComponentValue,
  DictionaryToolsService,
} from '../../../../shared/services/dictionary/dictionary-tools.service';
import { getPaymentRequestOptionGIBDD } from './select-map-object.helpers';
import { IFillCoordsResponse, IGeoCoordsResponse } from './select-map-object.interface';
import { SelectMapComponentAttrs, SelectMapObjectService } from './select-map-object.service';
import { ActionService } from '../../../../shared/directives/action/action.service';
import { NEXT_STEP_ACTION } from '../../../../shared/constants/actions';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ModalErrorService } from '../../../../modal/modal-error.service';
import { ConfirmationModalComponent } from '../../../../modal/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'epgu-constructor-select-map-object',
  templateUrl: './select-map-object.component.html',
  styleUrls: ['./select-map-object.component.scss'],
  providers: [UnsubscribeService, SelectMapObjectService],
  changeDetection: ChangeDetectionStrategy.Default, // @todo. заменить на OnPush
})
export class SelectMapObjectComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('detailsTemplate', { static: false }) detailsTemplate;
  @ViewChild('informationTemplate', { static: false }) informationTemplate;
  @ViewChild('libLookup', { static: false }) libLookup: ConstructorLookupComponent;
  data: ComponentBase;
  applicantAnswers: ApplicantAnswersDto;
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
  public isNoDepartmentErrorVisible = false;
  public screenActionButtons: ScreenButton[] = [];

  private componentValue: ComponentValue;
  private componentPresetValue: ComponentValue;
  private screenStore: ScreenStore;
  private needToAutoFocus = false; // Флаг из атрибутов для авто центровки ближайшего объекта к центру
  private needToAutoCenterAllPoints = false;
  private DEFAULT_ZOOM = 9;
  private nextStepAction = NEXT_STEP_ACTION;

  private initData$ = combineLatest([
    this.screenService.component$,
    this.screenService.applicantAnswers$,
  ]);

  constructor(
    public selectMapObjectService: SelectMapObjectService,
    public config: ConfigService,
    private yaMapService: YaMapService,
    private dictionaryApiService: DictionaryApiService,
    private ngUnsubscribe$: UnsubscribeService,
    public screenService: ScreenService,
    private cdr: ChangeDetectorRef,
    private modalService: ModalService,
    private modalErrorService: ModalErrorService,
    private zone: NgZone,
    private deviceDetector: DeviceDetectorService,
    private dictionaryToolsService: DictionaryToolsService,
    private actionService: ActionService,
    private currentAnswersService: CurrentAnswersService,
  ) {
    this.isMobile = this.deviceDetector.isMobile;
  }

  ngOnInit(): void {
    this.initData$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(([data, applicantAnswers]: [ComponentBase, ApplicantAnswersDto]) => {
        this.data = data;
        this.applicantAnswers = applicantAnswers;
        this.initVariable();
        this.subscribeToEmmitNextStepData();
      });

    this.screenService.buttons$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((buttons: Array<ScreenButton>) => {
        this.screenActionButtons = buttons || [];
        this.cdr.markForCheck();
      });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.showMap = true;
      this.cdr.markForCheck();
    });
    this.selectMapObjectService.templates.detailsTemplate = this.detailsTemplate;
    this.selectMapObjectService.templates.informationTemplate = this.informationTemplate;
  }

  ngOnDestroy(): void {
    this.clearMapVariables();
  }

  public lookupChanged(mapObject: DictionaryYMapItem, lookup: ConstructorLookupComponent): void {
    this.selectMapObject(mapObject);
    lookup.clearInput();
  }

  public providerSearch(): (val: string) => Observable<Partial<ListElement>[]> {
    return (searchString): Observable<Partial<ListElement>[]> => {
      this.selectMapObjectService.searchMapObject(searchString);
      return of(
        this.dictionaryToolsService.adaptDictionaryToListItem(
          this.selectMapObjectService.filteredDictionaryItems,
        ),
      );
    };
  }

  public selectObject(item: DictionaryYMapItem): void {
    this.selectedValue = item;
    if (this.selectedValue && this.screenService.component.attrs.isNeedToCheckGIBDDPayment) {
      this.availablePaymentInGIBDD(this.selectedValue.attributeValues.code)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(() => this.nextStep());
      return;
    }

    this.nextStep();
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

  private initVariable(): void {
    this.initComponentAttrs();
    this.controlsLogicInit();
  }

  private initComponentAttrs(): void {
    this.selectMapObjectService.componentAttrs = this.data.attrs as SelectMapComponentAttrs;
    this.needToAutoFocus = this.data.attrs.autoMapFocus;
    this.needToAutoCenterAllPoints = this.data.attrs.autoCenterAllPoints;
    this.componentValue = JSON.parse(this.data.value || '{}');
    this.componentPresetValue = JSON.parse(this.data.presetValue || '{}');
    this.screenStore = this.screenService.getStore();
  }

  private initSelectedValue(): void {
    if ((this.data?.value && this.data?.value !== '{}') || this.needToAutoCenterAllPoints) {
      const mapObject = UtilsService.tryToParse(this.data?.value) as DictionaryYMapItem;
      // Если есть idForMap (из cachedAnswers) то берем его, иначе пытаемся использовать из attrs.selectedValue
      if (mapObject.idForMap !== undefined && this.isFiltersSame()) {
        this.selectMapObjectService.centeredPlaceMark(mapObject.center, mapObject.idForMap);
      } else if (this.data?.attrs.selectedValue) {
        const selectedValue = this.getSelectedValue();
        this.selectMapObjectService.centeredPlaceMarkByObjectValue(selectedValue.id);
      } else if (this.needToAutoFocus && this.areMapObjectsFound()) {
        this.selectClosestMapObject();
      } else if (this.needToAutoCenterAllPoints) {
        this.centerAllPoints();
      }
    }
  }

  private areMapObjectsFound(): boolean {
    return this.selectMapObjectService.filteredDictionaryItems.length > 0;
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

    if (this.isOnlySecondaryFilterRequestNeeded()) {
      this.fillCoords(this.data.attrs.secondaryDictionaryFilter)
        .pipe(
          takeUntil(this.ngUnsubscribe$),
          catchError((error) => this.handleError(error)),
          filter((coords: IGeoCoordsResponse) => !!coords),
          tap((coords: IGeoCoordsResponse) => this.handleGettingCoordinatesResponse(coords)),
        )
        .subscribe();
      return;
    }

    this.fillCoords(this.data.attrs.dictionaryFilter)
      .pipe(
        takeUntil(this.ngUnsubscribe$),
        switchMap((coords: IFillCoordsResponse) => {
          if (this.isSecondReqNeeded(coords)) {
            return this.fillCoords(this.data.attrs.secondaryDictionaryFilter);
          }
          return of(coords);
        }),
        catchError((error) => this.handleError(error)),
        filter((coords: IGeoCoordsResponse) => !!coords),
        tap((coords: IGeoCoordsResponse) => this.handleGettingCoordinatesResponse(coords)),
      )
      .subscribe();
  }

  private isOnlySecondaryFilterRequestNeeded(): boolean {
    return (
      this.data.arguments?.dictionaryFilterPriority ===
      DictionaryFilterPriority.secondaryDictionaryFilter
    );
  }

  private handleError(error): Observable<null> {
    this.modalErrorService.showError(error);
    return of(null);
  }

  private handleGettingCoordinatesResponse(coords: IGeoCoordsResponse): void {
    this.handleFilledCoordinate(coords);
    this.mapIsLoaded = true;
    this.initSelectedValue();
    this.cdr.detectChanges();
    this.libLookup.lookupComponent.setSearchBarFocus();
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
  private fillCoords(
    dictionaryFilters: Array<ComponentDictionaryFilterDto>,
  ): Observable<IFillCoordsResponse> {
    let options;
    try {
      options = this.getOptions(dictionaryFilters);
    } catch (e) {
      return throwError(e);
    }
    return this.dictionaryApiService.getSelectMapDictionary(this.getDictionaryType(), options).pipe(
      switchMap((dictionary: DictionaryResponseForYMap) => {
        this.isNoDepartmentErrorVisible = !dictionary.total;
        this.selectMapObjectService.dictionary = dictionary;
        const needToFilterMvd =
          this.data.attrs.mvdFilters && this.componentValue.isMvdFiltersActivatedOnFront === 'true';
        // Параллелим получение геоточек на 4 запроса
        const items = needToFilterMvd
          ? this.applyRegionFilters(dictionary.items, this.data.attrs.mvdFilters)
          : [...dictionary.items];

        const chunkSize = items.length / 4;
        return merge(
          this.selectMapObjectService.getCoordsByAddress(items.splice(0, chunkSize)),
          this.selectMapObjectService.getCoordsByAddress(items.splice(0, chunkSize)),
          this.selectMapObjectService.getCoordsByAddress(items.splice(0, chunkSize)),
          this.selectMapObjectService.getCoordsByAddress(items),
        ).pipe(
          reduce((acc, { coords }) => {
            return { ...acc, coords: [...acc.coords, ...coords] };
          }),
          map((coords) => {
            return {
              ...coords,
              dictionaryError: dictionary.error,
            };
          }),
        );
      }),
    );
  }

  /**
   * Подготовка тела POST запроса dictionary
   * @param dictionaryFilters фильтры из атрибутов компонента
   */
  private getOptions(dictionaryFilters: Array<ComponentDictionaryFilterDto>): DictionaryOptions {
    return {
      ...this.dictionaryToolsService.getFilterOptions(
        this.componentPresetValue,
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

  private nextStep(): void {
    this.zone.run(() => {
      const answer = {
        ...this.selectedValue,
        children: null,
        regOkato: this.componentValue?.regOkato,
        okato: this.componentValue?.okato,
      };

      const confirmationModalButtons = this.screenActionButtons.filter(
        (button) => button.type === ActionType.confirmModalStep,
      );

      if (confirmationModalButtons.length > 0) {
        this.actionService.openConfirmationModal(confirmationModalButtons[0], this.data.id, () => {
          this.currentAnswersService.state = answer;
          this.actionService.switchAction(this.nextStepAction, this.screenService.component.id);
        });
      } else {
        this.currentAnswersService.state = answer;
        this.actionService.switchAction(this.nextStepAction, this.screenService.component.id);
      }
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

  private centerAllPoints(): void {
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

  private isFiltersSame(): boolean {
    const valueFilters = this.dictionaryToolsService.getFilterOptions(
      this.componentValue,
      this.screenStore,
      this.data.attrs.dictionaryFilter,
    );
    const valuePresetFilters = this.dictionaryToolsService.getFilterOptions(
      this.componentPresetValue,
      this.screenStore,
      this.data.attrs.dictionaryFilter,
    );
    return _isEqual(valueFilters, valuePresetFilters);
  }

  private isSecondReqNeeded(coords: IFillCoordsResponse): boolean {
    return (
      coords.coords.length === 0 &&
      coords.dictionaryError.code === 0 &&
      !!this.data.attrs.secondaryDictionaryFilter
    );
  }

  private applyRegionFilters(
    items: Array<DictionaryYMapItem>,
    mvdFilters: Array<IMvdFilter>,
  ): Array<DictionaryYMapItem> {
    const filteredMvdFilters = mvdFilters.filter((mvdFilter) =>
      mvdFilter.fiasList.some((fias) =>
        ['*', this.componentValue.fiasLevel1, this.componentValue.fiasLevel4].includes(fias),
      ),
    );
    const lastFilteredMvdFilter = filteredMvdFilters.pop();

    return items.filter((department) => {
      return lastFilteredMvdFilter
        ? lastFilteredMvdFilter.value.includes(department[lastFilteredMvdFilter.field])
        : false;
    });
  }
}