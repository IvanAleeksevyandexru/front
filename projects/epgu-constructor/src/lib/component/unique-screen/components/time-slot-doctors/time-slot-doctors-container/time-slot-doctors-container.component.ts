import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filter, map, takeUntil, tap } from 'rxjs/operators';
import { ListElement, ListItem } from '@epgu/epgu-lib';
import {
  ComponentAttrsDto,
  ComponentDictionaryFilterDto,
  ConfirmationModal,
  DictionaryConditions,
  DictionaryOptions,
  DictionaryValueTypes,
  DisplayDto,
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
  TimeSlotDoctorsAttrs,
  TimeSlotDoctorsComponentDto,
} from '../time-slot-doctors.interface';
import { DictionaryToolsService } from '../../../../../shared/services/dictionary/dictionary-tools.service';
import { CustomComponent } from '../../../../custom-screen/components-list.types';
import { COMMON_ERROR_MODAL_PARAMS } from '../../../../../core/services/error-handler/error-handler';
import { ConfirmationModalComponent } from '../../../../../modal/confirmation-modal/confirmation-modal.component';
import { DateTypeTypes, TimeSlotsConstants } from '../../time-slots/time-slots.constants';
import {
  TimeSlot,
  TimeSlotsAnswerInterface,
  TimeSlotValueInterface,
} from '../../time-slots/time-slots.types';
import { ActionService } from '../../../../../shared/directives/action/action.service';
import { NEXT_STEP_ACTION } from '../../../../../shared/constants/actions';
import { TimeSlotDoctorService } from '../time-slot-doctor.service';
import { TimeSlotDoctorsComponent } from '../time-slot-doctors.component';

@Component({
  selector: 'epgu-constructor-time-slot-doctors-container',
  templateUrl: './time-slot-doctors-container.component.html',
})
export class TimeSlotDoctorsContainerComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('timeSlotDoctorsComponent') timeSlotDoctorsComponent: TimeSlotDoctorsComponent;

  isLoading$: Observable<boolean> = this.screenService.isLoading$;
  data$: Observable<DisplayDto> = this.screenService.display$;

  slotsLoadingStatus$$ = new BehaviorSubject<boolean>(false);

  public date: Date = null;

  public activeMonthNumber: number;
  public activeYearNumber: number;
  public chosenTimeStr: string;
  public isChosenTimeStrVisible = false;

  readonly daysNotFoundTemplate: ErrorTemplate = {
    header: 'Нет свободного времени для приёма',
    description: 'Всё занято на ближайшие 14 дней. Выберите другого врача',
  };

  readonly timeNotFoundTemplate: ErrorTemplate = {
    header: 'В этот день всё занято',
    description: 'Выберите другой, чтобы забронировать время',
  };

  confirmModalParameters: ConfirmationModal = {
    text: 'Вы уверены, что хотите поменять забронированное время?',
    showCloseButton: false,
    buttons: [
      {
        label: 'Да',
        closeModal: true,
        handler: this.bookTimeSlot.bind(this),
      },
      {
        label: 'Нет',
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
  bookedSlot: SlotInterface;
  errorMessage;

  get monthsRange(): string {
    return Array.from(this._monthsRange).join(' — ');
  }
  specProvider;
  doctorProvider;

  specLookupControl = new FormControl();
  docLookupControl = new FormControl();

  component: TimeSlotDoctorsComponentDto;
  timeSlotDoctors$: Observable<TimeSlotDoctorsComponentDto> = this.screenService.component$.pipe(
    map((component: TimeSlotDoctorsComponentDto) => {
      return { ...component, parsedValue: this.screenService.componentValue };
    }),
    tap((component: TimeSlotDoctorsComponentDto) => {
      this.timeSlotDoctorService.isByMedRef = !component.attrs.ts.department;

      this.component = component;
      this.setProviders(component);
    }),
    filter((component: TimeSlotDoctorsComponentDto) => !!component.value),
  );

  private errorModalResultSub = new Subscription();
  private cachedAnswer: TimeSlotsAnswerInterface;
  private nextStepAction = NEXT_STEP_ACTION;
  private firstDayOfMainSection: Date;
  private daysInMainSection: number;
  private visibleMonths = {}; // Мапа видимых месяцев. Если показ идет с текущей даты и доступные дни залезли на новый месяц, то показываем этот месяц
  private _monthsRange = new Set();
  private today: Date;

  constructor(
    public screenService: ScreenService,
    public currentAnswersService: CurrentAnswersService,
    public timeSlotDoctorService: TimeSlotDoctorService,
    private dictionaryToolsService: DictionaryToolsService,
    private modalService: ModalService,
    public constants: TimeSlotsConstants,
    private ngUnsubscribe$: UnsubscribeService,
    private changeDetectionRef: ChangeDetectorRef,
    private datesHelperService: DatesToolsService,
    private httpCancelService: HttpCancelService,
    private actionService: ActionService,
  ) {}

  ngOnInit(): void {
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
  }

  ngAfterViewInit(): void {
    this.focusOnFirstLookup();
  }

  ngOnDestroy(): void {
    this.httpCancelService.cancelPendingRequests();
  }

  handleSpecLookupValue(specLookup: ListElement): void {
    const prevState = this.timeSlotDoctorService.state$$.getValue();
    setTimeout(() => {
      this.docLookupControl.setValue('');
      this.timeSlotDoctorService.state$$.next({ ...prevState, specLookup: null, docLookup: null });
      setTimeout(() => {
        this.timeSlotDoctorService.state$$.next({ ...prevState, specLookup, docLookup: null });
        setTimeout(() => this.timeSlotDoctorsComponent.docLookup.setFocus());
      });
    });
  }

  handleDocLookupValue(docLookup: ListElement): void {
    const prevState = this.timeSlotDoctorService.state$$.getValue();
    const bookingRequestAttrs: Partial<BookingRequestAttrs> = {};
    docLookup.originalItem.attributes.forEach((attribute) => {
      bookingRequestAttrs[attribute.name] = attribute.value;
    });
    this.timeSlotDoctorService.state$$.next({ ...prevState, docLookup, bookingRequestAttrs });
    this.loadTimeSlots();
  }

  /**
   * Проверяет есть ли в текущем месяце пустые слоты
   * Если да, to this.isExistsSlots = true
   * Функция вызывается при каждой регенерации календаря
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
   * Клик по дню на календаре. Повторный клик по уже выбранному дню отменяет выбор
   * @param date день для выбора
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
   * Клик по слоту на календаре. Повторный клик по уже выбранному слоту отменяет выбор
   * @param slot слот для выбора
   */
  chooseTimeSlot(slot: SlotInterface): void {
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
   * Отправка формы.
   *  Если есть забуканный слот
   *
   *      и значение не менялось то передаем ответ из cachedAnswers.
   *      и значение менялось, то модалка для подтверждения
   *
   *  Иначе, букаем слот
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
          this.showError(
            `${
              this.constants.errorFailBookTimeSlot
            }  (${this.timeSlotDoctorService.getErrorMessage()})`,
          );
          return;
        }
        const answer = {
          ...response,
          department: this.timeSlotDoctorService.department,
          docLookup: this.timeSlotDoctorService.state$$.getValue().docLookup,
          specLookup: this.timeSlotDoctorService.state$$.getValue().specLookup,
        };
        this.setBookedTimeStr(this.currentSlot);
        this.currentAnswersService.state = answer;
        this.actionService.switchAction(this.nextStepAction, this.screenService.component.id);
        this.changeDetectionRef.markForCheck();
      },
      () => {
        this.inBookingProgress = false;
        this.showModal(COMMON_ERROR_MODAL_PARAMS);
        this.changeDetectionRef.markForCheck();
      },
    );
  }

  showError(errorMessage: string): void {
    this.errorModalResultSub.unsubscribe();
    const params = {
      ...COMMON_ERROR_MODAL_PARAMS,
      buttons: [
        {
          label: 'Попробовать ещё раз',
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

  private focusOnFirstLookup(): void {
    if (this.timeSlotDoctorService.isByMedRef) {
      this.timeSlotDoctorsComponent.docLookup.setFocus();
    } else {
      this.timeSlotDoctorsComponent.specLookup.setFocus();
    }
  }

  private setProviders(component: TimeSlotDoctorsComponentDto): void {
    this.specProvider = {
      search: this.providerSearch(component, component.attrs.specLookup, () => []),
    };
    if (this.timeSlotDoctorService.isByMedRef) {
      this.doctorProvider = {
        search: this.providerSearch(component, component.attrs.docLookup, () => []),
      };
    } else {
      this.doctorProvider = {
        search: this.providerSearch(component, component.attrs.docLookup, () => [
          {
            attributeName: 'Service_Id',
            condition: DictionaryConditions.EQUALS,
            value: JSON.stringify(this.timeSlotDoctorService.state$$.getValue().specLookup.id),
            valueType: DictionaryValueTypes.value,
          },
        ]),
      };
    }
  }

  private providerSearch(
    component: TimeSlotDoctorsComponentDto,
    attrs: ComponentAttrsDto,
    getInitialDictionaryFilterFunc: () => ComponentDictionaryFilterDto[],
  ): (val: string) => Observable<Partial<ListElement>[]> {
    return (searchString): Observable<Partial<ListElement>[]> => {
      let additionalParams = {};
      const filters = [...attrs.searchProvider.dictionaryFilter];
      const startFilter = attrs.searchProvider?.turnOffStartFilter;

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

      return this.dictionaryToolsService
        .getDictionaries$(
          attrs.dictionaryType as string,
          { ...component, attrs } as CustomComponent,
          {
            ...attrs.searchProvider.dictionaryOptions,
            ...dictionaryOptions,
            ...{ additionalParams },
          } as DictionaryOptions,
        )
        .pipe(
          map((reference) => {
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

    this.initServiceVariables(value);
    this.timeSlotDoctorService.init(value, this.cachedAnswer).subscribe(
      async (isBookedDepartment) => {
        if (this.timeSlotDoctorService.hasError()) {
          this.inLoadingProgress = false;
          this.errorMessage = this.timeSlotDoctorService.getErrorMessage();
          if (this.errorMessage === 101) {
            this.errorMessage = `${this.errorMessage}: ${this.constants.error101ServiceUnavailable}`;
          }
          this.showError(`${this.constants.errorInitialiseService} (${this.errorMessage})`);
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
    // Заполняем список месяцев в шапке календаря
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

  // TODO
  // eslint-disable-next-line @typescript-eslint/typedef
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

    // TODO избавиться от Date.now, переделать на DatesToolsService.getToday()
    if (dateType === DateTypeTypes.TODAY) {
      return new Date(this.today || Date.now());
    }

    if (dateType === DateTypeTypes.REF_DATE && refDateAttr) {
      return new Date(refDateAttr);
    }

    throw Error(`dateType has incorrect value "${dateType}" or missed refDate attr in json`);
  }

  /**
   * Проверяет дату по ограничениям на валидность
   * @param {Date} date дата для валидации
   * @param startType тип обрезания даты, например, до начала дня ('day'), до начала месяца ('month')
   * @returns {boolean} false - дата прошла проверки. true - дата инвалидна
   */
  private checkDateRestrictions(date: Date, startType: StartOfTypes = 'day'): boolean {
    const refDate = this.datesHelperService.startOf(this.getRefDate(), startType);

    const restrictions =
      (this.screenService.component?.attrs as TimeSlotDoctorsAttrs)?.ts?.restrictions || {};
    // Объект с функциями проверки дат на заданные ограничения
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
    // Перебираем все ключи restrictions из attrs до первого "плохого"
    // пример: "minDate": [30, "d"],
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
   * Создается и заполняет массив для выпадающего списка месяцев
   * Месяцы создаются от минимального до максимального из эндпоинта самих слотов
   */
  private fillMonthsYears(): void {
    this.monthsYears = [];
    const availableMonths = this.timeSlotDoctorService.getAvailableMonths();
    if (availableMonths.length) {
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
        // Чтобы в начале списка не было "серых" месяцев
        if (!monthForDropdown.unselectable || this.monthsYears.length) {
          this.monthsYears.push(monthForDropdown);
        }
      }
      if (this.currentMonth) {
        this.currentMonth = this.monthsYears.find(({ id }) => id === this.currentMonth.id);
      } else {
        this.currentMonth = this.monthsYears[0] as ListItem;
      }
    }
  }

  /**
   * Устанавливает забуканный слот при его наличие, иначе пытается его проставить из кэша ответов
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

  private setBookedTimeStr(slot: SlotInterface): void {
    const time = this.datesHelperService.utcOffset(slot.slotTime, slot.timezone);

    this.chosenTimeStr = this.datesHelperService.format(time, DATE_TIME_STRING_FULL);
  }

  /**
   * Метод очищает выбранные на календаре день и время
   */
  private clearDateSelection(): void {
    this.date = null;
    this.currentSlot = null;
    this.currentAnswersService.state = null;
    this.timeSlots = null;
    this.recalcDaysStyles();
  }

  /**
   * Инициализирует атрибуты сервиса
   * @param componentValue value из компонента из display
   */
  private initServiceVariables(componentValue: TimeSlotValueInterface): void {
    const timeSlotFromCache = this.cachedAnswer?.timeSlot;
    // waitingTimeExpired - Флаг просрочки бронирования
    const { waitingTimeExpired } = componentValue;

    this.setBookedSlot(timeSlotFromCache, waitingTimeExpired);
    if (this.bookedSlot) {
      this.setBookedTimeStr(this.bookedSlot);
    }
  }

  /**
   * Обработка инициализации текущего сервиса
   * @param isBookedDepartment Флаг показывающий что выбран департамент, на который уже есть бронь
   */
  private async serviceInitHandle(isBookedDepartment: boolean): Promise<void> {
    this.isChosenTimeStrVisible = isBookedDepartment && !!this.bookedSlot;
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
