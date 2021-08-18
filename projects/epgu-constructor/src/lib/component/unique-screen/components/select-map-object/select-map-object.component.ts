import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { YaMapService } from '@epgu/epgu-lib';
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
import { get, isEqual as _isEqual } from 'lodash';
import {
  ActionType,
  ApplicantAnswersDto,
  ComponentDictionaryFilterDto,
  DictionaryOptions,
  ScreenButton,
  DictionaryFilterPriority,
} from '@epgu/epgu-constructor-types';
import {
  ModalService,
  DeviceDetectorService,
  UnsubscribeService,
  ConfigService,
  AddressesToolsService,
  YMapItem,
  IGeoCoordsResponse,
  YandexMapService,
} from '@epgu/epgu-constructor-ui-kit';

import { ScreenService } from '../../../../screen/screen.service';
import { ComponentBase, ScreenStore } from '../../../../screen/screen.types';
import { DictionaryApiService } from '../../../../shared/services/dictionary/dictionary-api.service';
import {
  DictionaryItem,
  DictionaryResponseForYMap,
} from '../../../../shared/services/dictionary/dictionary-api.types';
import {
  ComponentValue,
  DictionaryToolsService,
} from '../../../../shared/services/dictionary/dictionary-tools.service';
import { getPaymentRequestOptionGIBDD } from './select-map-object.helpers';
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
import { PanelTypes } from './components/search-panel-resolver/search-panel-resolver.component';
import { ContentTypes } from './components/balloon-content-resolver/balloon-content-resolver.component';
import { JsonHelperService } from '../../../../core/services/json-helper/json-helper.service';
import { COMMON_ERROR_MODAL_PARAMS } from '../../../../core/services/error-handler/error-handler';
import { NavigationService } from '../../../../core/services/navigation/navigation.service';

const INTERNAL_ERROR_MESSAGE = 'Internal Error';

@Component({
  selector: 'epgu-constructor-select-map-object',
  templateUrl: './select-map-object.component.html',
  styleUrls: ['./select-map-object.component.scss'],
  providers: [UnsubscribeService, SelectMapObjectService, YandexMapService],
  changeDetection: ChangeDetectionStrategy.Default, // @todo. заменить на OnPush
})
export class SelectMapObjectComponent implements OnInit, AfterViewInit, OnDestroy {
  data: ComponentBase;
  applicantAnswers: ApplicantAnswersDto;
  public mappedDictionaryForLookup;
  public mapCenter: number[];
  public mapControls = [];
  public selectedValue;
  public showMap = false;
  public mapIsLoaded = false;
  public scrollConfig = { suppressScrollX: true, wheelPropagation: false };
  public isMobile: boolean;
  public isSearchTitleVisible = true;
  public isNoDepartmentErrorVisible = false;
  public screenActionButtons: ScreenButton[] = [];
  public searchPanelType: PanelTypes;
  public balloonContentType: ContentTypes;

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
    public yandexMapService: YandexMapService,
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
    private addressesToolsService: AddressesToolsService,
    private jsonHelperService: JsonHelperService,
    private navigationService: NavigationService,
  ) {
    this.isMobile = this.deviceDetector.isMobile;
  }

  ngOnInit(): void {
    this.screenService.isLoaderVisible.next(true);
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
      .subscribe((buttons: ScreenButton[]) => {
        this.screenActionButtons = buttons || [];
        this.cdr.markForCheck();
      });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.showMap = true;
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.clearMapVariables();
  }

  public selectObject(item: YMapItem<DictionaryItem>): void {
    if (this.selectedValue && this.screenService.component.attrs.isNeedToCheckGIBDDPayment) {
      this.availablePaymentInGIBDD(item.attributeValues.code)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(() => this.nextStep(item));
      return;
    }

    this.nextStep(item);
  }

  private initVariable(): void {
    this.initComponentAttrs();
    this.controlsLogicInit();
  }

  private initComponentAttrs(): void {
    this.selectMapObjectService.componentAttrs = this.data.attrs as SelectMapComponentAttrs;
    this.selectMapObjectService.mapType = this.data.attrs.mapType as MapTypes;
    this.yandexMapService.mapOptions = this.data.attrs.mapOptions;
    this.searchPanelType =
      this.data.attrs.mapType === MapTypes.electionsMap
        ? PanelTypes.electionsPanel
        : PanelTypes.commonPanel;
    this.balloonContentType =
      this.data.attrs.mapType === MapTypes.electionsMap
        ? ContentTypes.electionsContent
        : ContentTypes.commonContent;
    this.needToAutoFocus = this.data.attrs.autoMapFocus;
    this.needToAutoCenterAllPoints = this.data.attrs.autoCenterAllPoints;
    this.componentValue = JSON.parse(this.data.value || '{}');
    this.componentPresetValue = JSON.parse(this.data.presetValue || '{}');
    this.screenStore = this.screenService.getStore();
  }

  private initSelectedValue(): void {
    if ((this.data?.value && this.data?.value !== '{}') || this.needToAutoCenterAllPoints) {
      const mapObject = this.jsonHelperService.tryToParse(this.data?.value) as YMapItem<
        DictionaryItem
      >;
      // Если есть idForMap (из cachedAnswers) то берем его, иначе пытаемся использовать из attrs.selectedValue
      if (mapObject.idForMap !== undefined && this.isFiltersSame()) {
        this.yandexMapService.selectMapObject(mapObject);
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
    const selectedValue = (get(
      this.applicantAnswers,
      this.data?.attrs.selectedValue,
    ) as unknown) as string;
    return JSON.parse(selectedValue);
  }

  private subscribeToEmmitNextStepData(): void {
    this.yandexMapService.selectedValue$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((value: DictionaryItem) => {
        this.isSearchTitleVisible = !value || !this.isMobile;
        this.selectedValue = value;
        // this.expandObject(value);
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
      this.mapIsLoaded = true;
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
    if ((error?.message || error) === INTERNAL_ERROR_MESSAGE) {
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
    } else {
      this.modalErrorService.showError(error);
    }
    return of(null);
  }

  private handleGettingCoordinatesResponse(coords: IGeoCoordsResponse): void {
    this.handleFilledCoordinate(coords);
    this.mapIsLoaded = true;
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
    this.tryInitSelectedObject();
  }

  private tryInitSelectedObject(): void {
    if (this.selectedValue) {
      this.selectMapObject(this.getSelectedObject());
    }
  }

  private getSelectedObject(): YMapItem<DictionaryItem> {
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
        this.isNoDepartmentErrorVisible = !dictionary.total;
        this.selectMapObjectService.dictionary = dictionary;
        // Параллелим получение геоточек на 4 запроса
        const items = [...dictionary.items];
        const addresses = items.map(
          (item: DictionaryItem) =>
            item.attributeValues[this.screenService.component.attrs.attributeNameWithAddress],
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

  private selectMapObject(mapObject: YMapItem<DictionaryItem>): void {
    if (!mapObject) return;
    this.selectMapObjectService.centeredPlaceMark(mapObject.center, mapObject);
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
    chosenMapObject = this.yandexMapService.getObjectById(chosenMapObject.objectId);
    this.yandexMapService.centeredPlaceMark(chosenMapObject);
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
}
