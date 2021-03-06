import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filter, map, takeUntil, tap } from 'rxjs/operators';
import { ListElement, ListItem } from '@epgu/ui/models/dropdown';
import {
  ComponentAttrsDto,
  ComponentDictionaryFilterDto,
  ConfirmationModal,
  DictionaryConditions,
  DictionaryOptions,
  DictionaryValueTypes,
  DisplayDto,
  IBookingErrorHandling,
} from '@epgu/epgu-constructor-types';
import { FormControl } from '@angular/forms';
import {
  DATE_STRING_YEAR_MONTH,
  DATE_TIME_STRING_FULL,
  DatesToolsService,
  HttpCancelService,
  IDay,
  ModalService,
  SlotInterface,
  StartOfTypes,
  UnsubscribeService,
  weekDaysAbbr,
  months,
  ErrorTemplate,
} from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../../../../screen/screen.service';
import { CurrentAnswersService } from '../../../../../screen/current-answers.service';
import {
  BookingRequestAttrs,
  LkApiItemAttributes,
  TimeSlotDoctorsAttrs,
  TimeSlotDoctorsComponentDto,
} from '../time-slot-doctors.interface';
import { DictionaryToolsService } from '../../../../../shared/services/dictionary/dictionary-tools.service';
import {
  CustomComponent,
  CustomListGenericData,
} from '../../../../custom-screen/components-list.types';
import {
  COMMON_ERROR_MODAL_PARAMS,
  SERVICE_OR_SPEC_SESSION_TIMEOUT,
  ITEMS_FAILURE,
  SERVICE_OR_SPEC_NO_AVAILABLE,
} from '../../../../../core/services/error-handler/error-handler';
import { ConfirmationModalComponent } from '../../../../../modal/confirmation-modal/confirmation-modal.component';
import { DateTypeTypes, TimeSlotsConstants } from '../../time-slots/time-slots.constants';
import {
  ErrorInterface,
  TimeSlot,
  TimeSlotsAnswerInterface,
  TimeSlotValueInterface,
} from '../../time-slots/time-slots.types';
import { ActionService } from '../../../../../shared/directives/action/action.service';
import { NEXT_STEP_ACTION } from '../../../../../shared/constants/actions';
import { TimeSlotDoctorService } from '../time-slot-doctor.service';
import { TimeSlotDoctorsComponent } from '../time-slot-doctors.component';
import {
  DictionaryItem,
  DictionaryResponse,
} from '../../../../../shared/services/dictionary/dictionary-api.types';
import { FormPlayerService } from '../../../../../form-player/services/form-player/form-player.service';
import { DictionaryService } from '../../../../../shared/services/dictionary/dictionary.service';

/* eslint-disable max-len */
export const STATIC_ERROR_MESSAGE = '?????????????????? ?? ?????????????????? 14 ???????? ?????? ???????????????????? ??????????????';
export const STATIC_ERROR_TEMPLATE = `???????????????? ???????????? ?????????????????????????? ?????????? ?????? <a data-action-type='prevStep'>???????????? ?????????????????????? ??????????????????????</a>`;

export const SMEV2_SERVICE_OR_SPEC_SESSION_TIMEOUT = '?????????????????????? ??????????';
export const SMEV3_SERVICE_OR_SPEC_NO_AVAILABLE = '?? ?????????????????? ???????? ?????????????? ????????????';
export const NO_DATA = '?? ?????????????????? ?????????? ?????????????????????? ?????????????????????? ??????????????????';
@Component({
  selector: 'epgu-constructor-time-slot-doctors-container',
  templateUrl: './time-slot-doctors-container.component.html',
})
export class TimeSlotDoctorsContainerComponent implements OnInit, OnDestroy {
  @ViewChild('timeSlotDoctorsComponent') timeSlotDoctorsComponent: TimeSlotDoctorsComponent;

  isLoading$: Observable<boolean> = this.screenService.isLoading$;
  data$: Observable<DisplayDto> = this.screenService.display$;

  slotsLoadingStatus$$ = new BehaviorSubject<boolean>(false);
  doctorWasChosen$$ = new BehaviorSubject<boolean>(false);

  public date: Date = null;

  public activeMonthNumber: number;
  public activeYearNumber: number;
  public selectedTimeStr = '';

  daysNotFoundTemplate: ErrorTemplate = {
    header: '?????? ???????????????????? ?????????????? ?????? ????????????',
    description: '???????? ???????? ?????????? ???? ?????????????????? 14 ????????. ???????????????? ?????????????? ??????????????????????',
  };

  timeNotFoundTemplate: ErrorTemplate = {
    header: '?? ???????? ???????? ?????? ????????????',
    description: '???????????????? ????????????, ?????????? ?????????????????????????? ??????????',
  };

  doctorsNotFoundTemplate: ErrorTemplate = {
    header: `<h6 class='yellow-line mt-24'>?????????? ???? ??????????????</h6>`,
    description: `<div class='mt-6 text-color--text-helper' style='font-size: 14px; margin-top: 6px;'>
      {textAsset}
    </div>`,
  };

  confirmModalParameters: ConfirmationModal = {
    text: '???? ??????????????, ?????? ???????????? ???????????????? ?????????????????????????????? ???????????',
    showCloseButton: false,
    buttons: [
      {
        label: '????',
        closeModal: true,
        handler: this.bookTimeSlot.bind(this),
      },
      {
        label: '??????',
        closeModal: true,
        color: 'white',
      },
    ],
  };

  public daysOfWeek = weekDaysAbbr;
  public months = months;

  weeks: IDay[][] = [];
  monthsYears: ListItem[] = [];
  timeSlots: SlotInterface[] = [];
  dialogButtons = [];
  isExistsSlots = true;
  currentSlot: SlotInterface;
  currentMonth: ListItem;
  blockMobileKeyboard = false;
  fixedMonth = false;
  inLoadingProgress = false;
  inBookingProgress = false;
  changeTSConfirm = false;
  isDoctorNotAvailable = false;
  areSlotsNotAvailable = false;
  bookedSlot: SlotInterface;
  today: Date;
  errorMessage;

  get monthsRange(): string {
    return Array.from(this._monthsRange).join(' ??? ');
  }
  specProvider;
  doctorProvider;

  specLookupControl = new FormControl();
  docLookupControl = new FormControl();
  checkboxControl = new FormControl();

  component: TimeSlotDoctorsComponentDto;
  timeSlotDoctors$: Observable<TimeSlotDoctorsComponentDto> = this.screenService.component$.pipe(
    filter((component: TimeSlotDoctorsComponentDto) => !!component.value),
    map((component: TimeSlotDoctorsComponentDto) => {
      return { ...component, parsedValue: this.screenService.componentValue };
    }),
    tap((component: TimeSlotDoctorsComponentDto) => {
      this.timeSlotDoctorService.bookingErrorHandlingParams =
        component.attrs.ts?.bookingErrorHandling;

      this.timeSlotDoctorService.isOnlyDocLookupNeeded =
        !component.attrs.ts.department || component.attrs.isOnlyDocLookupNeeded;
      this.timeSlotDoctorService.timeSlotsType = component.attrs.ts.timeSlotType.value;
      this.component = component;
      this.setProviders(component);
    }),
  );

  private errorModalResultSub = new Subscription();
  private cachedAnswer: TimeSlotsAnswerInterface;
  private nextStepAction = NEXT_STEP_ACTION;
  private firstDayOfMainSection: Date;
  private daysInMainSection: number;
  private visibleMonths = {}; // ???????? ?????????????? ??????????????. ???????? ?????????? ???????? ?? ?????????????? ???????? ?? ?????????????????? ?????? ?????????????? ???? ?????????? ??????????, ???? ???????????????????? ???????? ??????????
  private _monthsRange = new Set();

  constructor(
    public screenService: ScreenService,
    public currentAnswersService: CurrentAnswersService,
    public timeSlotDoctorService: TimeSlotDoctorService,
    public constants: TimeSlotsConstants,
    private dictionaryService: DictionaryService,
    private dictionaryToolsService: DictionaryToolsService,
    private modalService: ModalService,
    private ngUnsubscribe$: UnsubscribeService,
    private changeDetectionRef: ChangeDetectorRef,
    private datesHelperService: DatesToolsService,
    private httpCancelService: HttpCancelService,
    private actionService: ActionService,
    private formPlayer: FormPlayerService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.today = await this.datesHelperService.getToday(true);

    const cachedAnswer = this.screenService.getComponentData(
      this.screenService.getCompValueFromCachedAnswers(),
    );
    if (cachedAnswer && typeof cachedAnswer !== 'string') {
      this.cachedAnswer = cachedAnswer as TimeSlotsAnswerInterface;
    }

    if (this.screenService.component) {
      this.setCancelReservation(
        this.screenService.component.id,
        this.screenService.component.attrs?.cancelReservation,
      );
    }

    this.focusOnFirstLookup();
  }

  ngOnDestroy(): void {
    this.timeSlotDoctorService.state$$.next({
      specLookup: null,
      docLookup: null,
      bookingRequestAttrs: null,
    });
    this.httpCancelService.cancelPendingRequests();
  }

  handleSpecLookupValue(specLookup: ListElement): void {
    const prevState = this.timeSlotDoctorService.state$$.getValue();
    this.docLookupControl.setValue('');
    this.timeSlotDoctorService.state$$.next({ ...prevState, specLookup, docLookup: null });
    // 100???? ???????????? ?????? ???????????? ?????????? ?????????????? ?????????? ?????????? ?????????? ?? ???????????? ????????????.
    setTimeout(() => {
      this.timeSlotDoctorsComponent.docLookup.lookupComponent.lookupItemsOrClose(true);
      this.timeSlotDoctorsComponent.docLookup.setFocus();
    }, 100);
  }

  handleDocLookupValue(docLookup: ListElement): void {
    this.doctorWasChosen$$.next(true);
    const prevState = this.timeSlotDoctorService.state$$.getValue();
    const bookingRequestAttrs: Partial<BookingRequestAttrs> = {};
    docLookup.originalItem.attributes.forEach((attribute) => {
      bookingRequestAttrs[attribute.name] = attribute.value;
    });
    this.timeSlotDoctorService.state$$.next({ ...prevState, docLookup, bookingRequestAttrs });
    this.loadTimeSlots();
  }

  /**
   * ?????????????????? ???????? ???? ?? ?????????????? ???????????? ???????????? ??????????
   * ???????? ????, to this.isExistsSlots = true
   * ?????????????? ???????????????????? ?????? ???????????? ?????????????????????? ??????????????????
   */
  checkExistenceSlots(): void {
    this.isExistsSlots = this.weeks.some((week) => {
      return week.some((day) => {
        return !this.isDateLocked(day.date, this.firstDayOfMainSection, this.daysInMainSection);
      });
    });
  }

  isToday(date: Date): boolean {
    return (
      date.getUTCFullYear() === this.today.getUTCFullYear() &&
      date.getUTCMonth() === this.today.getUTCMonth() &&
      date.getUTCDate() === this.today.getUTCDate()
    );
  }

  isSelected(date: Date): boolean {
    return this.datesHelperService.isSameDate(date, this.date);
  }

  isDateOutOfMonth(date: Date): boolean {
    return date && this.datesHelperService.getMonth(date) !== this.activeMonthNumber;
  }

  isDateLocked(date: Date, firstDayOfMainSection: Date, daysInMainSection: number): boolean {
    return (
      this.isDateOutOfSection(date, firstDayOfMainSection, daysInMainSection) ||
      this.timeSlotDoctorService.isDateLocked(date) ||
      this.checkDateRestrictions(date)
    );
  }

  /**
   * ???????? ???? ?????? ???? ??????????????????. ?????????????????? ???????? ???? ?????? ???????????????????? ?????? ???????????????? ??????????
   * @param date ???????? ?????? ????????????
   */
  selectDate(date: Date): void {
    if (this.isDateLocked(date, this.firstDayOfMainSection, this.daysInMainSection)) {
      return;
    }
    if (this.date?.toISOString() === date.toISOString()) {
      this.clearDateSelection();
    } else {
      this.date = date;
      this.recalcDaysStyles();
      this.showTimeSlots(date);
    }
  }

  /**
   * ???????? ???? ?????????? ???? ??????????????????. ?????????????????? ???????? ???? ?????? ???????????????????? ?????????? ???????????????? ??????????
   * @param slot ???????? ?????? ????????????
   */
  chooseTimeSlot(slot: SlotInterface): void {
    this.selectedTimeStr = this.datesHelperService.format(slot.slotTime, DATE_TIME_STRING_FULL);

    if (this.currentSlot?.slotId === slot.slotId) {
      this.clearDateSelection();
    } else {
      this.currentSlot = slot;
      this.currentAnswersService.state = slot;
    }
  }

  isSlotSelected({ slotId }: SlotInterface): boolean {
    return this.currentSlot && this.currentSlot.slotId === slotId;
  }

  showTimeSlots(date: Date): void {
    this.currentSlot = null;
    this.timeSlotDoctorService.getAvailableSlots(date).subscribe(
      (timeSlots) => {
        this.timeSlots = timeSlots;
        if (this.timeSlotDoctorService.hasError()) {
          this.showError(
            `${
              this.constants.errorLoadingTimeSlots
            } (${this.timeSlotDoctorService.getErrorMessage()})`,
          );
        }
        this.changeDetectionRef.markForCheck();
      },
      () => {
        this.showError(
          `${
            this.constants.errorLoadingTimeSlots
          }  (${this.timeSlotDoctorService.getErrorMessage()})`,
        );
        this.changeDetectionRef.markForCheck();
      },
    );
  }

  async monthChanged(ev: ListItem): Promise<void> {
    const { id } = ev;
    const [activeYear, activeMonth] = (id as string).split('-');
    this.activeMonthNumber = parseInt(activeMonth, 10) - 1;
    this.activeYearNumber = parseInt(activeYear, 10);
    await this.renderSingleMonthGrid(this.weeks);
    this.checkExistenceSlots();
  }

  /**
   * ???????????????? ??????????.
   *  ???????? ???????? ???????????????????? ????????
   *
   *      ?? ???????????????? ???? ???????????????? ???? ???????????????? ?????????? ???? cachedAnswers.
   *      ?? ???????????????? ????????????????, ???? ?????????????? ?????? ??????????????????????????
   *
   *  ??????????, ???????????? ????????
   */
  clickSubmit(): void {
    if (this.bookedSlot) {
      if (this.isCachedValueChanged()) {
        this.showModal(this.confirmModalParameters);
      } else {
        this.currentAnswersService.state = this.cachedAnswer;
        this.actionService.switchAction(this.nextStepAction, this.screenService.component.id);
      }
    } else {
      this.bookTimeSlot();
    }
  }

  bookTimeSlot(): void {
    this.inBookingProgress = true;
    this.timeSlotDoctorService.checkBooking(this.currentSlot).subscribe(
      (response) => {
        this.inBookingProgress = false;
        if (this.timeSlotDoctorService.hasError()) {
          this.errorMessage = this.timeSlotDoctorService.getErrorMessage();
          this.showCustomError(this.errorMessage);
          return;
        }
        const answer = {
          ...response,
          department: this.timeSlotDoctorService.department,
          docLookup: this.timeSlotDoctorService.state$$.getValue().docLookup,
          specLookup: this.timeSlotDoctorService.state$$.getValue().specLookup,
        };
        this.currentAnswersService.state = answer;
        this.actionService.switchAction(this.nextStepAction, this.screenService.component.id);
        this.changeDetectionRef.markForCheck();
      },
      (result) => {
        this.inBookingProgress = false;
        this.showCustomError(result?.error);
        this.changeDetectionRef.markForCheck();
      },
    );
  }

  showCustomError(error: string | ErrorInterface): void {
    if (error != null) {
      const errorMessage =
        typeof error === 'string' ? error : (error as ErrorInterface)?.errorDetail?.errorMessage;
      if (errorMessage.includes(SMEV2_SERVICE_OR_SPEC_SESSION_TIMEOUT)) {
        this.showModal(SERVICE_OR_SPEC_SESSION_TIMEOUT)
          .toPromise()
          .then((result) => {
            if (result) {
              this.formPlayer.initData();
            }
          });
      } else {
        const errorHandlingParams = this.findJsonParamsForErrorHandling(error);
        if (errorHandlingParams) {
          this.showModal(errorHandlingParams.modalAttributes).subscribe((result) => {
            if (result == 'changeSpec') {
              this.areSlotsNotAvailable = false;
              this.clearDateSelection();
              this.currentSlot = null;
              this.currentAnswersService.state = null;

              this.timeSlotDoctorService.state$$.next({
                ...this.timeSlotDoctorService.state$$.getValue(),
                docLookup: null,
                specLookup: null,
              });
              this.timeSlotDoctorsComponent.specLookup.clearInput();
              this.timeSlotDoctorsComponent.docLookup.clearInput();
            }
          });
        } else {
          const params = {
            ...ITEMS_FAILURE,
            buttons: [
              {
                label: '???????????? ????????????',
                color: 'white',
                closeModal: true,
                value: 'init',
              },
              {
                label: '?????????????????????? ?????? ??????',
                closeModal: true,
              },
            ],
          } as ConfirmationModal;
          const message = errorMessage
            .replace('FAILURE:', '')
            .replace('UNKNOWN_REQUEST_DESCRIPTION:', '')
            .replace('NO_DATA:', '');
          params.text = params.text.replace(/\{textAsset\}?/g, message);
          this.showModal(params)
            .toPromise()
            .then((result) => {
              if (result) {
                this.formPlayer.initData();
              }
            });
        }
      }
    } else {
      this.showModal(COMMON_ERROR_MODAL_PARAMS());
    }
  }

  showError(errorMessage: string): void {
    this.errorModalResultSub.unsubscribe();
    const params = {
      ...COMMON_ERROR_MODAL_PARAMS(),
      buttons: [
        {
          label: '?????????????????????? ?????? ??????',
          closeModal: true,
          value: errorMessage,
        },
      ],
    };
    const errorModalResult$ = this.showModal(params);

    this.errorModalResultSub = errorModalResult$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((result) => {
        if (result) {
          this.loadTimeSlots();
        }
        this.changeDetectionRef.markForCheck();
      });
  }

  showModal(params: ConfirmationModal): Observable<string> {
    return this.modalService.openModal(ConfirmationModalComponent, {
      ...params,
    });
  }

  filterByAttributeName(
    reference: CustomListGenericData<DictionaryResponse>,
    filterByAttributeName: string,
    searchString: string,
  ): DictionaryItem[] {
    return reference.data.items.filter((item) => {
      const attributes = (item.attributes as unknown) as LkApiItemAttributes[];
      return attributes.some((attribute) => {
        return (
          attribute.name === filterByAttributeName &&
          attribute.value.toLowerCase().includes(searchString.toLowerCase())
        );
      });
    });
  }

  focusOnFirstLookup(): void {
    if (this.timeSlotDoctorService.isOnlyDocLookupNeeded) {
      this.timeSlotDoctorsComponent.docLookup.setFocus();
    } else {
      this.timeSlotDoctorsComponent.specLookup.setFocus();
    }
  }

  handleMessageError(): void {
    this.errorMessage = this.timeSlotDoctorService.getErrorMessage();
    if (this.errorMessage === 101) {
      this.errorMessage = `${this.errorMessage}: ${this.constants.error101ServiceUnavailable}`;
    }
    if (this.errorMessage.includes(SMEV2_SERVICE_OR_SPEC_SESSION_TIMEOUT)) {
      this.showModal(SERVICE_OR_SPEC_SESSION_TIMEOUT)
        .toPromise()
        .then((result) => {
          if (result) {
            this.formPlayer.initData();
          }
        });
    } else if (this.component.attrs.ts.slotsNotFoundTemplate) {
      this.areSlotsNotAvailable = true;
    } else if (this.errorMessage.includes(NO_DATA)) {
      this.isDoctorNotAvailable = true;
      this.doctorsNotFoundTemplate.header = `
            <h6 class='yellow-line mt-24'>
              ?????? ???????????????????? ?????????????? ?????? ????????????
            </h6>`;
      this.doctorsNotFoundTemplate.description = `
            <div class='mt-6 text-color--text-helper' style='font-size: 14px; margin-top: 6px;'>
              ???????? ???????? ?????????? ???? ?????????????????? 14 ????????. ???????????????? ?????????????? ??????????????????????
            </div>`;
    } else {
      const message = this.errorMessage
        .replace('FAILURE:', '')
        .replace('UNKNOWN_REQUEST_DESCRIPTION:', '')
        .replace('NO_DATA:', '');
      this.isDoctorNotAvailable = true;
      this.doctorsNotFoundTemplate.header = `
            <h6 class='yellow-line mt-24'>
              ?????? ???????????????????? ?????????????? ?????? ????????????
            </h6>`;
      this.doctorsNotFoundTemplate.description = `
            <div class='mt-6 text-color--text-helper' style='font-size: 14px; margin-top: 6px;'>
              ${message}
            </div>`;
    }
  }

  handleLookupProviderErrorMessage(errorMessage: string, refName: string): void {
    if (errorMessage != null && errorMessage !== 'Operation completed') {
      if (
        !errorMessage.includes(SMEV2_SERVICE_OR_SPEC_SESSION_TIMEOUT) &&
        !errorMessage.includes(SMEV3_SERVICE_OR_SPEC_NO_AVAILABLE) &&
        refName !== 'ServiceOrSpecs'
      ) {
        this.isDoctorNotAvailable = true;
        const regExp = /\{textAsset\}?/g;
        // eslint-disable-next-line no-param-reassign
        errorMessage = errorMessage
          .replace('FAILURE:', '')
          .replace('UNKNOWN_REQUEST_DESCRIPTION:', '')
          .replace('NO_DATA:', '');

        if (errorMessage.includes(STATIC_ERROR_MESSAGE)) {
          this.doctorsNotFoundTemplate.description = this.doctorsNotFoundTemplate.description.replace(
            regExp,
            STATIC_ERROR_TEMPLATE,
          );
        } else {
          this.doctorsNotFoundTemplate.description = this.doctorsNotFoundTemplate.description.replace(
            regExp,
            errorMessage,
          );
        }
      }

      if (errorMessage.includes(SMEV3_SERVICE_OR_SPEC_NO_AVAILABLE) && refName === 'Resource') {
        const modalParams = {
          ...SERVICE_OR_SPEC_NO_AVAILABLE,
          buttons: [
            {
              label: '????????????????',
              closeModal: true,
            },
          ],
        };
        this.showModal(modalParams);
      }
    }
  }

  private findJsonParamsForErrorHandling(error: ErrorInterface | string): IBookingErrorHandling {
    if (typeof error !== 'object') {
      return null;
    }
    const { errorCode } = error.errorDetail;

    return this.timeSlotDoctorService.bookingErrorHandlingParams.find((param) => {
      const isCodesEqual = param.errorCode === String(errorCode);
      return param.errorMessageRegExp
        ? isCodesEqual && error.errorDetail.errorMessage.match(param.errorMessageRegExp)
        : isCodesEqual;
    });
  }

  private setProviders(component: TimeSlotDoctorsComponentDto): void {
    this.specProvider = {
      search: this.providerSearch(component, component.attrs.specLookup, () => []),
    };
    if (this.timeSlotDoctorService.isOnlyDocLookupNeeded) {
      this.doctorProvider = {
        search: this.providerSearch(component, component.attrs.docLookup, () => [], false),
      };
    } else {
      this.doctorProvider = {
        search: this.providerSearch(
          component,
          component.attrs.docLookup,
          () => [
            {
              attributeName: 'Service_Id',
              condition: DictionaryConditions.EQUALS,
              value: JSON.stringify(this.timeSlotDoctorService.state$$.getValue().specLookup.id),
              valueType: DictionaryValueTypes.value,
            },
          ],
          false,
        ),
      };
    }
  }

  private providerSearch(
    component: TimeSlotDoctorsComponentDto,
    attrs: ComponentAttrsDto,
    getInitialDictionaryFilterFunc: () => ComponentDictionaryFilterDto[],
    isCacheNeeded: boolean = true,
  ): (val: string) => Observable<Partial<ListElement>[]> {
    return (searchString): Observable<Partial<ListElement>[]> => {
      let additionalParams = {};
      const filters = [...attrs.searchProvider.dictionaryFilter];
      const startFilter = attrs.searchProvider?.turnOffStartFilter;
      this.isDoctorNotAvailable = false;

      if (!startFilter) {
        filters[0].value = searchString;
      } else {
        additionalParams = this.dictionaryToolsService.getAdditionalParams(
          this.screenService.getStore(),
          [...attrs.searchProvider.dictionaryOptions.additionalParams],
        );
      }

      const dictionaryOptions = this.dictionaryToolsService.getFilterOptions(
        component.parsedValue,
        this.screenService.getStore(),
        [...getInitialDictionaryFilterFunc(), ...filters],
      );

      return this.dictionaryService
        .getDictionaries$(
          attrs.dictionaryType as string,
          { ...component, attrs } as CustomComponent,
          {
            ...attrs.searchProvider.dictionaryOptions,
            ...dictionaryOptions,
            ...{ additionalParams },
          } as DictionaryOptions,
          isCacheNeeded,
        )
        .pipe(
          map((reference) => {
            const errorMessage = reference?.data?.error?.errorDetail?.errorMessage;
            let refName;

            if (Array.isArray(additionalParams)) {
              const result = additionalParams.filter(
                (param) => param?.value === 'ServiceOrSpecs' || param?.value === 'Resource',
              );
              refName = result.length > 0 ? result[0]?.value : undefined;
            }
            this.handleLookupProviderErrorMessage(errorMessage, refName);

            if (attrs.searchProvider.filterByAttributeName) {
              // eslint-disable-next-line no-param-reassign
              reference.data.items = this.filterByAttributeName(
                reference,
                attrs.searchProvider.filterByAttributeName,
                searchString,
              );
            }

            return this.dictionaryToolsService.adaptDictionaryToListItem(
              reference.data.items,
              reference.component.attrs.mappingParams,
              startFilter !== undefined && startFilter === true,
            );
          }),
        );
    };
  }

  private setCancelReservation(currentTimeSlotId: string, cancelReservation: string[]): void {
    this.timeSlotDoctorService.cancelReservation = [
      currentTimeSlotId,
      ...(cancelReservation || []),
    ];
  }

  private loadTimeSlots(): void {
    this.slotsLoadingStatus$$.next(false);
    this.inLoadingProgress = true;
    this.clearDateSelection();
    const value = JSON.parse(this.screenService.component?.value);
    this.areSlotsNotAvailable = false;
    this.isDoctorNotAvailable = false;
    this.isExistsSlots = true;

    this.initServiceVariables(value);
    this.timeSlotDoctorService.init(value, this.cachedAnswer).subscribe(
      async (isBookedDepartment) => {
        if (this.timeSlotDoctorService.hasError()) {
          this.inLoadingProgress = false;
          this.handleMessageError();
        } else {
          await this.serviceInitHandle(!!isBookedDepartment);
        }

        this.inLoadingProgress = false;

        this.checkExistenceSlots();

        this.changeDetectionRef.detectChanges();
      },
      (error) => {
        this.errorMessage = this.timeSlotDoctorService.getErrorMessage();
        this.inLoadingProgress = false;
        this.showError(
          `${this.constants.errorInitialiseService} (${this.errorMessage}) (${error})`,
        );

        this.changeDetectionRef.markForCheck();
      },
    );
  }

  private addDayToWeek(week: IDay[], date: Date, today: Date): void {
    const isOutOfSection = this.isDateOutOfSection(
      date,
      this.firstDayOfMainSection,
      this.daysInMainSection,
    );
    const isOutOfMonth = this.isDateOutOfMonth(date);
    const month = this.datesHelperService.getMonth(date);
    if (isOutOfMonth && !isOutOfSection) {
      this.visibleMonths[month] = true;
    }
    // ?????????????????? ???????????? ?????????????? ?? ?????????? ??????????????????
    if (!isOutOfSection) {
      const monthName = this.datesHelperService.format(date, 'LLLL');
      this._monthsRange.add(monthName.charAt(0).toUpperCase() + monthName.slice(1));
    }

    week.push({
      number: this.datesHelperService.getDate(date),
      date,
      classes: this.getDateStyles(today, date),
    });
  }

  private getDateStyles(today: Date, date: Date): { [key: string]: boolean } {
    const month = this.datesHelperService.getMonth(date);
    const isOutOfSection = this.isDateOutOfSection(
      date,
      this.firstDayOfMainSection,
      this.daysInMainSection,
    );
    const isOutOfMonth = this.isDateOutOfMonth(date);
    return {
      'is-past': this.datesHelperService.differenceInCalendarDays(today, date) < 0,
      today: this.isToday(date),
      locked: this.isDateLocked(date, this.firstDayOfMainSection, this.daysInMainSection),
      selected: this.isSelected(date),
      'outer-month': isOutOfMonth,
      'outer-section': isOutOfSection,
      visible: this.visibleMonths[month] || false,
    };
  }

  private recalcDaysStyles(): void {
    this.weeks = this.weeks.map((week) => {
      return week.map((day) => {
        const newDay = { ...day };
        newDay.classes = this.getDateStyles(this.today, newDay.date);
        return newDay;
      });
    });
  }

  private async renderSingleMonthGrid(output): Promise<void> {
    output.splice(0, output.length); // in-place clear
    const attrs = this.screenService.component?.attrs as TimeSlotDoctorsAttrs;
    const daysToShow = attrs?.ts.daysToShow;

    this.today = await this.datesHelperService.getToday(true);

    if (attrs?.ts.startSection === 'today') {
      this.firstDayOfMainSection = this.today;
    } else {
      this.firstDayOfMainSection = this.datesHelperService.setCalendarDate(
        this.today,
        this.activeYearNumber,
        this.activeMonthNumber,
        1,
      );
    }

    const firstDate = this.datesHelperService.startOfISOWeek(this.firstDayOfMainSection);
    this.daysInMainSection =
      daysToShow || this.datesHelperService.getDaysInMonth(this.firstDayOfMainSection);
    const lastDate = this.datesHelperService.endOfISOWeek(
      this.datesHelperService.add(this.firstDayOfMainSection, this.daysInMainSection - 1, 'days'),
    );
    const totalDays = this.datesHelperService.differenceInCalendarDays(firstDate, lastDate);
    let date = firstDate;
    let week = 0;
    output.push([]);
    for (let i = 0; i <= totalDays; i += 1) {
      if (output[week].length && output[week].length % 7 === 0) {
        week += 1;
        output.push([]);
      }
      this.addDayToWeek(output[week], date, this.today);
      date = this.datesHelperService.add(date, 1, 'days');
    }
  }

  private getMonthsListItem(monthYear: string): ListItem {
    const [activeYear, activeMonth] = monthYear.split('-');
    const monthNumber = parseInt(activeMonth, 10) - 1;
    const yearNumber = parseInt(activeYear, 10);
    return new ListItem({
      id: `${monthYear}`,
      text: `${this.months[monthNumber]} ${yearNumber}`,
    });
  }

  private getRefDate(): Date {
    const dateType = this.screenService.component?.attrs?.dateType || DateTypeTypes.TODAY;
    const refDateAttr = this.screenService.component?.attrs?.refDate;

    if (dateType === DateTypeTypes.TODAY) {
      return new Date(this.today);
    }

    if (dateType === DateTypeTypes.REF_DATE && refDateAttr) {
      return new Date(refDateAttr);
    }

    throw Error(`dateType has incorrect value "${dateType}" or missed refDate attr in json`);
  }

  /**
   * ?????????????????? ???????? ???? ???????????????????????? ???? ????????????????????
   * @param {Date} date ???????? ?????? ??????????????????
   * @param startType ?????? ?????????????????? ????????, ????????????????, ???? ???????????? ?????? ('day'), ???? ???????????? ???????????? ('month')
   * @returns {boolean} false - ???????? ???????????? ????????????????. true - ???????? ??????????????????
   */
  private checkDateRestrictions(date: Date, startType: StartOfTypes = 'day'): boolean {
    const refDate = this.datesHelperService.startOf(this.getRefDate(), startType);

    const restrictions =
      (this.screenService.component?.attrs as TimeSlotDoctorsAttrs)?.ts?.restrictions || {};
    // ???????????? ?? ?????????????????? ???????????????? ?????? ???? ???????????????? ??????????????????????
    const checks = {
      minDate: (amount, type): boolean => {
        let expectedBefore = this.datesHelperService.add(refDate, amount, type);
        expectedBefore = this.datesHelperService.startOf(expectedBefore, startType);
        return this.datesHelperService.isBefore(date, expectedBefore);
      },
      maxDate: (amount, type): boolean => {
        let expectedAfter = this.datesHelperService.add(refDate, amount, type);
        expectedAfter = this.datesHelperService.startOf(expectedAfter, startType);
        return this.datesHelperService.isAfter(date, expectedAfter);
      },
    };
    // ???????????????????? ?????? ?????????? restrictions ???? attrs ???? ?????????????? "??????????????"
    // ????????????: "minDate": [30, "d"],
    return Object.keys(restrictions).some((key) => {
      const [amount, type] = restrictions[key];
      return checks[key](amount, type);
    });
  }

  private isCachedValueChanged(): boolean {
    const slotIdFromAnswer = this.cachedAnswer?.timeSlot.slotId;
    return slotIdFromAnswer !== this.currentSlot.slotId;
  }

  /**
   * ?????????????????? ?? ?????????????????? ???????????? ?????? ?????????????????????? ???????????? ??????????????
   * ???????????? ?????????????????? ???? ???????????????????????? ???? ?????????????????????????? ???? ?????????????????? ?????????? ????????????
   */
  private fillMonthsYears(): void {
    this.monthsYears = [];
    const availableMonths = this.timeSlotDoctorService.getAvailableMonths();
    if (availableMonths?.length) {
      availableMonths.sort((date1: string, date2: string): number => {
        return new Date(date1) > new Date(date2) ? 1 : -1;
      });
      const firstMonthStr = availableMonths[0];
      const lastMonthStr = availableMonths[availableMonths.length - 1];
      for (
        let month = this.datesHelperService.parse(firstMonthStr, DATE_STRING_YEAR_MONTH);
        !this.datesHelperService.isAfter(
          month,
          this.datesHelperService.parse(lastMonthStr, DATE_STRING_YEAR_MONTH),
        );
        month = this.datesHelperService.add(month, 1, 'months')
      ) {
        const monthForDropdown = this.getMonthsListItem(
          this.datesHelperService.format(month, DATE_STRING_YEAR_MONTH),
        );
        if (
          !availableMonths.includes(
            this.datesHelperService.format(month, DATE_STRING_YEAR_MONTH),
          ) ||
          this.checkDateRestrictions(this.datesHelperService.toDate(month), 'month')
        ) {
          monthForDropdown.unselectable = true;
        }
        // ?????????? ?? ???????????? ???????????? ???? ???????? "??????????" ??????????????
        if (!monthForDropdown.unselectable || this.monthsYears.length) {
          this.monthsYears.push(monthForDropdown);
        }
      }
      this.currentMonth =
        (this.currentMonth && this.monthsYears.find(({ id }) => id === this.currentMonth.id)) ||
        this.monthsYears[0];
    }
  }

  /**
   * ?????????????????????????? ???????????????????? ???????? ?????? ?????? ??????????????, ?????????? ???????????????? ?????? ???????????????????? ???? ???????? ??????????????
   */
  private setBookedSlot(timeSlot: TimeSlot, waitingTimeExpired: boolean): void {
    this.timeSlotDoctorService.waitingTimeExpired = waitingTimeExpired;
    let bookedSlot = this.timeSlotDoctorService.getBookedSlot();
    if (!bookedSlot && timeSlot) {
      bookedSlot = {
        slotId: timeSlot.slotId,
        slotTime: new Date(timeSlot.visitTimeISO),
        timezone: timeSlot.visitTimeISO.substr(-6),
        areaId: timeSlot.areaId,
      };
      this.timeSlotDoctorService.setBookedSlot(bookedSlot);
      this.timeSlotDoctorService.bookId = this.cachedAnswer.bookId;
    }

    this.bookedSlot = waitingTimeExpired ? null : bookedSlot;
  }

  /**
   * ?????????? ?????????????? ?????????????????? ???? ?????????????????? ???????? ?? ??????????
   */
  private clearDateSelection(): void {
    this.date = null;
    this.currentSlot = null;
    this.currentAnswersService.state = null;
    this.timeSlots = null;
    this.selectedTimeStr = '';
    this.recalcDaysStyles();
  }

  /**
   * ???????????????????????????? ???????????????? ??????????????
   * @param componentValue value ???? ???????????????????? ???? display
   */
  private initServiceVariables(componentValue: TimeSlotValueInterface): void {
    const timeSlotFromCache = this.cachedAnswer?.timeSlot;
    // waitingTimeExpired - ???????? ?????????????????? ????????????????????????
    const { waitingTimeExpired } = componentValue;

    this.setBookedSlot(timeSlotFromCache, waitingTimeExpired);
  }

  /**
   * ?????????????????? ?????????????????????????? ???????????????? ??????????????
   * @param isBookedDepartment ???????? ???????????????????????? ?????? ???????????? ??????????????????????, ???? ?????????????? ?????? ???????? ??????????
   */
  private async serviceInitHandle(isBookedDepartment: boolean): Promise<void> {
    this.errorMessage = undefined;
    this.activeMonthNumber = this.timeSlotDoctorService.getCurrentMonth();
    this.activeYearNumber = this.timeSlotDoctorService.getCurrentYear();

    this.fillMonthsYears();
    this.fixedMonth = this.monthsYears.length < 2;
    if (this.currentMonth) {
      await this.monthChanged(this.currentMonth);
    }

    if (this.bookedSlot && isBookedDepartment) {
      this.selectDate(this.bookedSlot.slotTime);
      this.chooseTimeSlot(this.bookedSlot);
    }

    this.slotsLoadingStatus$$.next(true);
  }

  private isDateOutOfSection(
    date: Date,
    firstDayOfMainSection: Date,
    daysInMainSection: number,
  ): boolean {
    const diff = this.datesHelperService.differenceInCalendarDays(firstDayOfMainSection, date);
    return diff < 0 || diff >= daysInMainSection;
  }
}
