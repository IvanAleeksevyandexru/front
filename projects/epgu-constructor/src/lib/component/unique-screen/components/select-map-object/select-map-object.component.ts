import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { combineLatest, merge, Observable, of, throwError } from 'rxjs';
import {
  catchError,
  filter,
  finalize,
  map,
  reduce,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { get } from 'lodash';
import {
  ActionType,
  ApplicantAnswersDto,
  ComponentDictionaryFilterDto,
  DictionaryOptions,
  ScreenButton,
  DictionaryFilterPriority,
  KeyValueMap,
} from '@epgu/epgu-constructor-types';
import {
  ModalService,
  UnsubscribeService,
  ConfigService,
  AddressesToolsService,
  YMapItem,
  IGeoCoordsResponse,
  YandexMapService,
} from '@epgu/epgu-constructor-ui-kit';

import { YaMapService } from '@epgu/ui/services/ya-map';
import { ScreenService } from '../../../../screen/screen.service';
import { ComponentBase, ScreenStore } from '../../../../screen/screen.types';
import { DictionaryApiService } from '../../../../shared/services/dictionary/dictionary-api.service';
import {
  DictionaryItem,
  DictionaryResponseForYMap,
  DictionaryYMapItem,
} from '../../../../shared/services/dictionary/dictionary-api.types';
import {
  ComponentValue,
  DictionaryToolsService,
} from '../../../../shared/services/dictionary/dictionary-tools.service';
import { arePointsEqual, getPaymentRequestOptionGIBDD } from './select-map-object.helpers';
import {
  IFillCoordsResponse,
  MapTypes,
  SelectMapComponentAttrs,
  SelectMapObjectService,
} from './select-map-object.service';
import { ActionService } from '../../../../shared/directives/action/action.service';
import { NEXT_STEP_ACTION } from '../../../../shared/constants/actions';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ModalErrorService } from '../../../../modal/modal-error.service';
import { ConfirmationModalComponent } from '../../../../modal/confirmation-modal/confirmation-modal.component';
import { JsonHelperService } from '../../../../core/services/json-helper/json-helper.service';
import {
  COMMON_ERROR_MODAL_PARAMS,
  NO_MAP_ITEMS_AVAILABLE,
} from '../../../../core/services/error-handler/error-handler';
import { NavigationService } from '../../../../core/services/navigation/navigation.service';
import { ActionToolsService } from '../../../../shared/directives/action/action-tools.service';
import { PriorityItemsService } from './services/priority-items/priority-items.service';

const INTERNAL_ERROR_MESSAGE = 'Internal Error';

@Component({
  selector: 'epgu-constructor-select-map-object',
  templateUrl: './select-map-object.component.html',
  styleUrls: ['./select-map-object.component.scss'],
  providers: [UnsubscribeService, SelectMapObjectService, YandexMapService],
  changeDetection: ChangeDetectionStrategy.Default, // @todo. заменить на OnPush
})
export class SelectMapObjectComponent implements OnInit, AfterViewChecked, OnDestroy {
  data: ComponentBase;
  applicantAnswers: ApplicantAnswersDto;
  public mapCenter: number[];
  public mapControls = [];
  public showMap = false;
  public isNoDepartmentErrorVisible = false;
  public screenActionButtons: ScreenButton[] = [];
  public initZoom: number;
  public hasPreviouslyChoosen: DictionaryItem;

  private componentValue: ComponentValue;
  private componentPresetValue: ComponentValue;
  private screenStore: ScreenStore;
  private needToAutoFocus = false; // Флаг из атрибутов для авто центровки ближайшего объекта к центру
  private needToAutoCenterAllPoints = false;
  private DEFAULT_ZOOM = 9;
  private nextStepAction = NEXT_STEP_ACTION;
  private isMultiSelect = false;
  private isCommonDictionary; // Флаг отвечающий за общую логику карты. Например для правосудия она отключается и реализована на searchPanel

  private initData$ = combineLatest([
    this.screenService.component$,
    this.screenService.applicantAnswers$,
  ]);
  private valueFromCache: string;

  constructor(
    public config: ConfigService,
    public screenService: ScreenService,
    public selectMapObjectService: SelectMapObjectService,
    public yandexMapService: YandexMapService,
    private actionService: ActionService,
    private actionToolsService: ActionToolsService,
    private addressesToolsService: AddressesToolsService,
    private cdr: ChangeDetectorRef,
    private currentAnswersService: CurrentAnswersService,
    private dictionaryApiService: DictionaryApiService,
    private dictionaryToolsService: DictionaryToolsService,
    private jsonHelperService: JsonHelperService,
    private modalErrorService: ModalErrorService,
    private modalService: ModalService,
    private navigationService: NavigationService,
    private ngUnsubscribe$: UnsubscribeService,
    private yaMapService: YaMapService,
    private zone: NgZone,
    private priorityItemsService: PriorityItemsService,
  ) {}

  ngOnInit(): void {
    this.screenService.isLoaderVisible.next(true);
    this.initData$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(([data, applicantAnswers]: [ComponentBase, ApplicantAnswersDto]) => {
        this.data = data;
        this.applicantAnswers = applicantAnswers;
        this.initVariable();
      });

    this.screenService.buttons$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((buttons: ScreenButton[]) => {
        this.screenActionButtons = buttons || [];
        this.cdr.markForCheck();
      });
  }

  ngAfterViewChecked(): void {
    this.showMap = true;
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.clearMapVariables();
  }

  public selectObject(yaMapItem: YMapItem<DictionaryItem>): void {
    if (this.isMultiSelect) {
      // eslint-disable-next-line no-param-reassign
      yaMapItem.isSelected = !yaMapItem.isSelected;
      const matchDictionaryItem = this.selectMapObjectService.filteredDictionaryItems.find(
        (dictionaryItem) => {
          return arePointsEqual(dictionaryItem, yaMapItem);
        },
      );
      matchDictionaryItem.isSelected = yaMapItem.isSelected;
      this.yandexMapService.mapPaint();
      let arr = this.priorityItemsService.getItems();
      if (this.selectMapObjectService.isSelectedView.getValue()) {
        this.selectMapObjectService.handleKindergartenSelection();
      }
      if (yaMapItem.isSelected) {
        arr.push(yaMapItem);
      } else {
        arr = arr.filter((value) => {
          return value.objectId !== yaMapItem.objectId;
        });
      }
      this.priorityItemsService.set(arr);
    } else {
      this.prepareNextStep(yaMapItem);
    }
  }

  public closeBaloon(): void {
    if (this.selectMapObjectService.isSelectedView.getValue()) {
      this.selectMapObjectService.resetSelectedView();
      this.selectMapObjectService.placeChildsHomeOnMap();
    } else {
      this.yandexMapService.closeBalloon();
    }
  }

  private prepareNextStep(item: YMapItem<DictionaryItem>): void {
    if (this.screenService.component.attrs.isNeedToCheckGIBDDPayment) {
      this.availablePaymentInGIBDD((item.attributeValues?.code as string) || item.value)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(() => this.nextStep(item));
      return;
    }

    this.nextStep(item);
  }

  private initVariable(): void {
    this.initComponentAttrs();
    if (this.isCommonDictionary) {
      this.controlsLogicInit();
    }
    this.initMapCenter();
  }

  private initComponentAttrs(): void {
    this.selectMapObjectService.componentAttrs = this.data.attrs as SelectMapComponentAttrs;
    this.yandexMapService.componentAttrs = this.data.attrs;

    this.selectMapObjectService.mapType =
      (this.data.attrs.mapType as MapTypes) || MapTypes.commonMap;
    this.yandexMapService.mapOptions = this.data.attrs.mapOptions;
    this.initZoom = this.data.attrs.mapOptions?.initZoom as number;
    this.isMultiSelect = this.data.attrs.isMultiSelect;
    this.isCommonDictionary = this.data.attrs.isCommonDictionary ?? true;
    this.valueFromCache = this.screenService.getCompValueFromCachedAnswers();
    this.needToAutoFocus = this.data.attrs.autoMapFocus;
    this.needToAutoCenterAllPoints = this.data.attrs.autoCenterAllPoints;
    this.componentValue = JSON.parse(this.data.value || '{}');
    this.componentPresetValue = JSON.parse(this.data.presetValue || '{}');
    this.screenStore = this.screenService.getStore();
  }

  private initSelectedValue(): void {
    if (this.isMultiSelect) {
      this.selectMapObjectService.handleMultiSelectCentering();
    } else if ((this.data?.value && this.data?.value !== '{}') || this.needToAutoCenterAllPoints) {
      const mapObject = this.jsonHelperService.tryToParse(this.data?.value) as YMapItem<
        DictionaryItem
      >;
      // Если есть idForMap (из cachedAnswers) то берем его, иначе пытаемся использовать из attrs.selectedValue
      if (mapObject.idForMap !== undefined && this.isMapObjectExisted(mapObject)) {
        mapObject.expanded = false;
        this.hasPreviouslyChoosen = mapObject;
        this.yandexMapService.selectMapObject(mapObject);
      } else if (this.data?.attrs.selectedValue) {
        const selectedValue = this.getSelectedValue();
        this.selectMapObjectService.centeredPlaceMarkByObjectValue(selectedValue.id as string);
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
  private getSelectedValue(): KeyValueMap {
    const selectedValue = (get(
      this.applicantAnswers,
      this.data?.attrs.selectedValue,
    ) as unknown) as string;
    return JSON.parse(selectedValue);
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
  }

  private getUrlTemplate(): string {
    const region = this.data.attrs.region ? `&region=${this.data.attrs.region}` : '';
    const url =
      `${this.config.lkuipElection}/${this.data.attrs.LOMurlTemplate}&electionLevel=${this.data.attrs.electionLevel}` +
      `&electionDate=${this.data.attrs.electionDate + region}`;
    return url;
  }

  /**
   * Инициализация карты - попытка определения центра, получение и расстановка точек на карте
   */
  private initMap(): void {
    if (this.data.attrs.LOMurlTemplate) {
      this.yandexMapService.placeObjectsOnMap(null, null, this.getUrlTemplate());
      this.selectMapObjectService.isMapLoaded.next(true);
      this.screenService.isLoaderVisible.next(false);
    } else {
      if (this.isOnlySecondaryFilterRequestNeeded()) {
        this.fillCoords(this.data.attrs.secondaryDictionaryFilter)
          .pipe(
            takeUntil(this.ngUnsubscribe$),
            catchError((error) => this.handleError(error)),
            filter((coords: IGeoCoordsResponse) => !!coords),
            tap((coords: IGeoCoordsResponse) => this.handleGettingCoordinatesResponse(coords)),
            finalize(() => this.screenService.isLoaderVisible.next(false)),
          )
          .subscribe();
        return;
      }

      this.fillCoords(this.data.attrs.dictionaryFilter)
        .pipe(
          takeUntil(this.ngUnsubscribe$),
          switchMap((coords: IGeoCoordsResponse) => {
            if (this.isSecondReqNeeded(coords)) {
              return this.fillCoords(this.data.attrs.secondaryDictionaryFilter);
            }
            return of(coords);
          }),
          catchError((error) => this.handleError(error)),
          filter((coords: IGeoCoordsResponse) => !!coords),
          tap((coords: IGeoCoordsResponse) => this.handleGettingCoordinatesResponse(coords)),
          finalize(() => this.screenService.isLoaderVisible.next(false)),
        )
        .subscribe();
    }
  }

  private isOnlySecondaryFilterRequestNeeded(): boolean {
    return (
      this.data.arguments?.dictionaryFilterPriority ===
      DictionaryFilterPriority.secondaryDictionaryFilter
    );
  }

  private handleError(error): Observable<null> {
    if (error === NO_MAP_ITEMS_AVAILABLE) {
      this.modalService.openModal(ConfirmationModalComponent, {
        ...NO_MAP_ITEMS_AVAILABLE,
        text: this.data.attrs.noDepartmentsErrorMsg
          ? this.data.attrs.noDepartmentsErrorMsg
          : error.text,
        buttons: [
          {
            label: 'Изменить регион',
            closeModal: true,
            value: 'prevStep',
            handler: (): void => this.navigationService.prev(),
          },
        ],
      });
    } else if (
      (error?.message || error) === INTERNAL_ERROR_MESSAGE &&
      this.notSpecificDictionary()
    ) {
      this.modalService
        .openModal(ConfirmationModalComponent, {
          ...COMMON_ERROR_MODAL_PARAMS,
          backdropDismiss: false,
          showCrossButton: false,
          buttons: [
            {
              label: 'На предыдущий шаг',
              closeModal: true,
              value: 'prevStep',
              handler: (): void => this.navigationService.prev(),
            },
          ],
        })
        .toPromise();
    } else if (this.notSpecificDictionary()) {
      this.modalErrorService.showError(error);
    }
    return of(null);
  }

  private notSpecificDictionary(): boolean {
    const dictionaryType = this.getDictionaryType();
    return (
      dictionaryType !== 'mzrf_lpu_equeue_smev3' &&
      dictionaryType !== 'mzrf_equeue_lpu' &&
      dictionaryType !== 'mzrf_lpu_vaccination'
    );
  }

  private handleGettingCoordinatesResponse(coords: IGeoCoordsResponse): void {
    this.handleFilledCoordinate(coords);
    this.selectMapObjectService.isMapLoaded.next(true);
    this.initSelectedValue();
    this.cdr.detectChanges();
  }

  /**
   * Обработка полученных координат - сохранение в массиве сервиса, расстановка на карте
   * @param coords ответ с бэка с координатами точек
   */
  private handleFilledCoordinate(coords: IGeoCoordsResponse): void {
    this.selectMapObjectService.saveCoords(coords);
    const items = this.selectMapObjectService.filteredDictionaryItems.map((item) => {
      return {
        center: item.center,
        obj: item,
      };
    });
    this.yandexMapService.placeObjectsOnMap(items);
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
    dictionaryFilters: ComponentDictionaryFilterDto[],
  ): Observable<IFillCoordsResponse> {
    let options;
    try {
      options = this.getOptions(dictionaryFilters);
    } catch (e) {
      return throwError(e);
    }
    return this.dictionaryApiService.getSelectMapDictionary(this.getDictionaryType(), options).pipe(
      switchMap((dictionary: DictionaryResponseForYMap) => {
        if (dictionary.error !== null && dictionary.error?.code !== 0) {
          return throwError(dictionary.error);
        }
        if (!dictionary.total) {
          return throwError(NO_MAP_ITEMS_AVAILABLE);
        }
        this.selectMapObjectService.dictionary = dictionary;
        if (this.isMultiSelect && this.valueFromCache) {
          this.applySelectedObjects(dictionary);
        }
        // Параллелим получение геоточек на 4 запроса
        const items = [...dictionary.items];
        const addresses = items.map(
          (item: DictionaryItem) =>
            item.attributeValues[
              this.screenService.component.attrs.attributeNameWithAddress
            ] as string,
        );

        const chunkSize = items.length / 4;
        return merge(
          this.addressesToolsService.getCoordsByAddress(addresses.splice(0, chunkSize)),
          this.addressesToolsService.getCoordsByAddress(addresses.splice(0, chunkSize)),
          this.addressesToolsService.getCoordsByAddress(addresses.splice(0, chunkSize)),
          this.addressesToolsService.getCoordsByAddress(addresses),
        ).pipe(
          reduce((acc, { coords }) => {
            return [...acc, ...coords];
          }, []),
          map((coords) => {
            return {
              coords,
              dictionaryError: dictionary.error,
            };
          }),
        );
      }),
    );
  }

  private applySelectedObjects(dictionary: DictionaryResponseForYMap): void {
    dictionary.items.forEach((item) => {
      const cachedValue = this.jsonHelperService.tryToParse(this.valueFromCache) as {
        items: DictionaryYMapItem[];
      };
      const patchValue = cachedValue?.items?.find(
        (cachedItem) => cachedItem.attributeValues.CODE === item.attributeValues.CODE,
      );
      if (patchValue) {
        Object.assign(item, patchValue);
      }
    });
  }

  /**
   * Подготовка тела POST запроса dictionary
   * @param dictionaryFilters фильтры из атрибутов компонента
   */
  private getOptions(dictionaryFilters: ComponentDictionaryFilterDto[]): DictionaryOptions {
    return {
      ...this.dictionaryToolsService.getFilterOptions(
        this.componentPresetValue,
        this.screenStore,
        dictionaryFilters,
      ),
      // TODO: после правки JSON услуг, вернуть
      // selectAttributes: this.screenService.component.attrs.selectAttributes || ['*'],
      selectAttributes: ['*'],
      pageSize: '100000',
    };
  }

  private getDictionaryType(): string {
    return this.selectMapObjectService.componentAttrs.dictionaryType;
  }

  private nextStep(value: YMapItem<DictionaryItem>): void {
    this.zone.run(() => {
      const answer = {
        ...value,
        children: null,
        regOkato: this.componentValue?.regOkato,
        okato: this.componentValue?.okato,
      };

      const confirmationModalButtons = this.screenActionButtons.filter(
        (button) => button.type === ActionType.confirmModalStep,
      );

      if (confirmationModalButtons.length > 0) {
        this.actionToolsService.openConfirmationModal(
          confirmationModalButtons[0],
          this.data.id,
          () => {
            this.currentAnswersService.state = answer;
            this.actionService.switchAction(this.nextStepAction, this.screenService.component.id);
          },
        );
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
  private availablePaymentInGIBDD(id: string): Observable<boolean> {
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

  private selectClosestMapObject(): void {
    const chosenMapObject = this.selectMapObjectService.findNearestObject(
      this.mapCenter,
      this.selectMapObjectService.filteredDictionaryItems,
    );
    this.yandexMapService.centeredPlaceMark(
      this.yandexMapService.getObjectById(chosenMapObject.objectId),
    );
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

  // Проверяет в справочнике наличие объекта из кэша
  private isMapObjectExisted(mapObject: YMapItem<DictionaryItem>): boolean {
    return this.selectMapObjectService.filteredDictionaryItems.some(
      ({ value }) => value === mapObject.value,
    );
  }

  private isSecondReqNeeded(coords: IFillCoordsResponse): boolean {
    return (
      coords.coords.length === 0 &&
      (coords.dictionaryError === null || coords.dictionaryError.code === 0) &&
      !!this.data.attrs.secondaryDictionaryFilter
    );
  }
}
