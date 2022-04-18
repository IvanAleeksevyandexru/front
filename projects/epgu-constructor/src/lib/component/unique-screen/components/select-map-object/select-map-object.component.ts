import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
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
  JsonHelperService,
} from '@epgu/epgu-constructor-ui-kit';

import { YaMapService } from '@epgu/ui/services/ya-map';
import { ScreenService } from '../../../../screen/screen.service';
import { ComponentBase, ScreenStore } from '../../../../screen/screen.types';
import { DictionaryApiService } from '../../../../shared/services/dictionary/dictionary-api.service';
import {
  DictionaryItem,
  DictionaryResponse,
  DictionaryResponseForYMap,
  DictionaryYMapItem,
} from '../../../../shared/services/dictionary/dictionary-api.types';
import { DictionaryToolsService } from '../../../../shared/services/dictionary/dictionary-tools.service';
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
import {
  COMMON_ERROR_MODAL_PARAMS,
  NO_MAP_ITEMS_AVAILABLE,
} from '../../../../core/services/error-handler/error-handler';
import { NavigationService } from '../../../../core/services/navigation/navigation.service';
import { ActionToolsService } from '../../../../shared/directives/action/action-tools.service';
import { PriorityItemsService } from './services/priority-items/priority-items.service';
import { ComponentValue } from '../../../../shared/services/dictionary/dictionary.interface';
import { InviteService } from '../../../../core/services/invite/invite.service';
import { KindergartenService } from '../kindergarten/kindergarten.service';

const INTERNAL_ERROR_MESSAGE = 'Internal Error';

@Component({
  selector: 'epgu-constructor-select-map-object',
  templateUrl: './select-map-object.component.html',
  styleUrls: ['./select-map-object.component.scss'],
  providers: [UnsubscribeService, SelectMapObjectService, YandexMapService],
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  public config: ConfigService;
  public screenService: ScreenService;
  public selectMapObjectService: SelectMapObjectService;
  public yandexMapService: YandexMapService;
  public invite: InviteService;

  protected addressesToolsService: AddressesToolsService;
  protected cdr: ChangeDetectorRef;
  protected ngUnsubscribe$: UnsubscribeService;

  private actionService: ActionService;
  private actionToolsService: ActionToolsService;

  private currentAnswersService: CurrentAnswersService;
  private dictionaryApiService: DictionaryApiService;
  private dictionaryToolsService: DictionaryToolsService;
  private jsonHelperService: JsonHelperService;
  private modalErrorService: ModalErrorService;
  private modalService: ModalService;
  private navigationService: NavigationService;

  private yaMapService: YaMapService;
  private zone: NgZone;
  private priorityItemsService: PriorityItemsService;
  private kindergartenService: KindergartenService;

  private componentValue: ComponentValue;
  private componentPresetValue: ComponentValue;
  private screenStore: ScreenStore;
  private needToAutoFocus = false; // Флаг из атрибутов для авто центровки ближайшего объекта к центру
  private needToAutoCenterAllPoints = false;
  private nextStepAction = NEXT_STEP_ACTION;
  private isMultiSelect = false;
  private isCommonDictionary; // Флаг отвечающий за общую логику карты. Например для правосудия она отключается и реализована на searchPanel

  private initData$;
  private valueFromCache: string;

  constructor(protected injector: Injector) {
    this.invite = injector.get(InviteService);
    this.config = injector.get(ConfigService);
    this.screenService = injector.get(ScreenService);
    this.selectMapObjectService = injector.get(SelectMapObjectService);
    this.yandexMapService = injector.get(YandexMapService);
    this.actionService = injector.get(ActionService);
    this.actionToolsService = injector.get(ActionToolsService);
    this.addressesToolsService = injector.get(AddressesToolsService);
    this.cdr = injector.get(ChangeDetectorRef);
    this.currentAnswersService = injector.get(CurrentAnswersService);
    this.dictionaryApiService = injector.get(DictionaryApiService);
    this.dictionaryToolsService = injector.get(DictionaryToolsService);
    this.jsonHelperService = injector.get(JsonHelperService);
    this.modalErrorService = injector.get(ModalErrorService);
    this.modalService = injector.get(ModalService);
    this.navigationService = injector.get(NavigationService);
    this.ngUnsubscribe$ = injector.get(UnsubscribeService);
    this.yaMapService = injector.get(YaMapService);
    this.zone = injector.get(NgZone);
    this.priorityItemsService = injector.get(PriorityItemsService);
    this.kindergartenService = injector.get(KindergartenService);

    this.initData$ = combineLatest([
      this.screenService.component$,
      this.screenService.applicantAnswers$,
    ]);
  }

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
        this.kindergartenService.handleKindergartenSelection();
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
      this.kindergartenService.placeChildsHomeOnMap();
    } else {
      this.yandexMapService.closeBalloon();
    }
  }

  /**
   * Инициализация карты - попытка определения центра, получение и расстановка точек на карте
   */
  protected initMap(): void {
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

      this.fillCoords(this.data.attrs.dictionaryFilter, !this.data.attrs.secondaryDictionaryFilter)
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

  protected handleGettingCoordinatesResponse(coords: IGeoCoordsResponse): void {
    this.handleFilledCoordinate(coords);
    this.selectMapObjectService.isMapLoaded.next(true);
    this.initSelectedValue();
    this.cdr.detectChanges();
  }

  protected handleError(error): Observable<null> {
    if (error === NO_MAP_ITEMS_AVAILABLE) {
      this.modalService.openModal(ConfirmationModalComponent, {
        ...NO_MAP_ITEMS_AVAILABLE,
        backdropDismiss: false,
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
          ...COMMON_ERROR_MODAL_PARAMS(),
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

  protected initSelectedValue(): void {
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
        this.yandexMapService.centerAllPoints();
      }
    }
  }

  /**
   * настройки для справочника объектов на карте и фильтров берем из атрибутов компонента с бэка
   * затем по адресам объектов получаем список координат
   * затем заполняем полученный справочник этими координтами и кладем в сервис
   * @param dictionaryFilters фильтры из атрибутов компонента
   */

  protected fillCoords(
    dictionaryFilters: ComponentDictionaryFilterDto[],
    isEmptyDictionaryCritical = true,
  ): Observable<IFillCoordsResponse> {
    let options;
    try {
      options = this.getOptions(dictionaryFilters);
    } catch (e) {
      return throwError(e);
    }

    return this.invite.getFilter().pipe(
      switchMap((invite) =>
        this.getDataSource(this.invite.setFilterOptions(invite, options)).pipe(
          switchMap((dictionary: DictionaryResponseForYMap) => {
            if (dictionary.error !== null && dictionary.error?.code !== 0) {
              return throwError(dictionary.error);
            }
            if (!dictionary.total && isEmptyDictionaryCritical) {
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
        ),
      ),
    );
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
    this.selectMapObjectService.userAddress = this.data?.arguments[
      this.data.attrs?.addressString?.value
    ] as string;
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

  private isOnlySecondaryFilterRequestNeeded(): boolean {
    return (
      this.data.arguments?.dictionaryFilterPriority ===
      DictionaryFilterPriority.secondaryDictionaryFilter
    );
  }

  private notSpecificDictionary(): boolean {
    const dictionaryType = this.getDictionaryType();
    return (
      dictionaryType !== 'mzrf_lpu_equeue_smev3' &&
      dictionaryType !== 'mzrf_equeue_lpu' &&
      dictionaryType !== 'mzrf_lpu_vaccination'
    );
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
    this.mapCenter = (geoCode || center || moscowCenter) as number[];
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
      selectAttributes: this.screenService.component.attrs.selectAttributes || ['*'],
      pageSize: this.screenService.component.attrs.pageSize || '100000',
    };
  }

  private getDataSource(options): Observable<DictionaryResponse> {
    if (this.componentValue?.barbarbokResponse) {
      return of(this.componentValue.barbarbokResponse as DictionaryResponse);
    }

    return this.dictionaryApiService.getSelectMapDictionary(this.getDictionaryType(), options);
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
      .getGenericDictionary(this.screenService.component.attrs.dictionaryGIBDD, options)
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
