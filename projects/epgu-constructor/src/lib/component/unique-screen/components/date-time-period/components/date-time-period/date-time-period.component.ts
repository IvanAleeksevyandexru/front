import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';
import { ListElement } from '@epgu/ui/models/dropdown';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { addDays, addYears, format, isSameDay, parseISO } from 'date-fns';
import { pairwise, startWith, tap } from 'rxjs/operators';
import { ComponentAttrsDto, ComponentDto } from '@epgu/epgu-constructor-types';
import { DatesToolsService } from '@epgu/epgu-constructor-ui-kit';
import { DatesHelperService } from '@epgu/ui/services/dates-helper';
import {
  getDateTimeObject,
  getTimeChunks,
  getTimeChunksDateObjects,
} from '../../utils/date-time-period.utils';
import { DateTimePeriodFormValues, DateTimePeriodState } from '../../date-time-period.types';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { ValidationService } from '../../../../../../shared/services/validation/validation.service';
import { DateRestrictionsService } from '../../../../../../shared/services/date-restrictions/date-restrictions.service';

@Component({
  selector: 'epgu-constructor-date-time-period',
  templateUrl: './date-time-period.component.html',
  styleUrls: ['./date-time-period.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateTimePeriodComponent implements OnInit, AfterViewInit {
  @Input() attrs: ComponentAttrsDto = {};

  @Input() initialState: DateTimePeriodState | null = null;

  @Input() component: ComponentDto;
  /**
   * Шаг в минутах
   */
  @Input() step = 15;

  @Output() updateState = new EventEmitter<DateTimePeriodState>();

  startTimeDropdownItems: ListElement[];
  endTimeDropdownItems: ListElement[];

  group: FormGroup;

  private startTimeInitialValue = '00:00';
  private timeFormat = 'HH:mm';
  private allTimeDropdownItems: ListElement[];

  constructor(
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private datesToolsService: DatesToolsService,
    private currentAnswersService: CurrentAnswersService,
    private validationService: ValidationService,
    private dateRestrictionsService: DateRestrictionsService,
  ) {
    this.allTimeDropdownItems = getTimeChunks(this.step, this.timeFormat).map((item) => ({
      id: item,
      text: item,
    }));
    this.startTimeDropdownItems = this.allTimeDropdownItems;
    this.endTimeDropdownItems = [];
  }

  ngOnInit(): void {
    const startDate = this.initStartDate();
    const startTime = this.initStartTime();
    const endDate = this.initEndDate();
    const endTime = this.initEndTime();
    this.group = this.formBuilder.group({
      startDate: [
        startDate,
        [Validators.required, this.validationService.dateValidator(this.component)],
      ],
      startTime: [startTime, Validators.required],
      endDate: [
        endDate,
        [Validators.required, this.validationService.dateValidator(this.component)],
      ],
      endTime: [endTime, Validators.required],
    });

    // при изменении значений формы корректируем при необходимости значения и вещаем событие updateState
    this.group.valueChanges
      .pipe(
        startWith(this.group.getRawValue() as DateTimePeriodFormValues),
        tap((values: DateTimePeriodFormValues) => {
          // формирование выпадающего списка с конечным временем
          this.setDateRangeToStore(values);
          this.endTimeDropdownItems = this.initStartTimeDropdownItems(values);
          this.cdr.markForCheck();
        }),
        pairwise(),
      )
      .subscribe(
        ([prevValues, nextValues]: [DateTimePeriodFormValues, DateTimePeriodFormValues]) => {
          const isStartDateChanged = prevValues.startDate !== nextValues.startDate;
          if (isStartDateChanged) {
            // eslint-disable-next-line no-param-reassign
            nextValues.endDate = null;
            this.group.patchValue(nextValues, { emitEvent: false });
          }
          if (!this.endTimeDropdownItems.some(({ id }) => id === nextValues.endTime?.id)) {
            // eslint-disable-next-line no-param-reassign
            nextValues.endTime = null;
            this.group.patchValue(nextValues, { emitEvent: false });
          }

          this.currentAnswersService.isValid = this.group.valid;

          const state = {
            startDateTime:
              this.datesToolsService.format(nextValues.startDate, "yyyy-MM-dd'T'") +
              (nextValues.startTime?.text || ''),
            endDateTime:
              this.datesToolsService.format(nextValues.endDate, "yyyy-MM-dd'T'") +
              (nextValues.endTime?.text || ''),
          };
          this.updateState.emit(state);
        },
      );
  }

  ngAfterViewInit(): void {
    // обновляем состояние кнопки "Отправить заявление"
    window.requestAnimationFrame(() => {
      this.group.updateValueAndValidity();
      this.currentAnswersService.isValid = this.group.valid;
    });
  }

  setOneDayPeriod(): void {
    const values = this.group.getRawValue();

    if (values.startDate && values.startTime) {
      const dateTimeObject = getDateTimeObject(
        values.startDate,
        values.startTime.id as string,
        this.timeFormat,
      );

      const endDateTimeObject = addDays(dateTimeObject, 1);

      this.group.patchValue({
        endDate: endDateTimeObject,
        endTime: values.startTime,
      });
    }
  }

  setOneYearPeriod(): void {
    const values = this.group.getRawValue();

    if (values.startDate && values.startTime) {
      const dateTimeObject = getDateTimeObject(
        values.startDate,
        values.startTime.id as string,
        this.timeFormat,
      );

      const endDateTimeObject = addYears(dateTimeObject, 1);

      this.group.patchValue({
        endDate: endDateTimeObject,
        endTime: values.startTime,
      });
    }
  }

  setOneHundredYearsPeriod(): void {
    const values = this.group.getRawValue();

    if (values.startDate && values.startTime) {
      const dateTimeObject = getDateTimeObject(
        values.startDate,
        values.startTime.id as string,
        this.timeFormat,
      );

      const endDateTimeObject = addYears(dateTimeObject, 100);

      this.group.patchValue({
        endDate: endDateTimeObject,
        endTime: values.startTime,
      });
    }
  }

  public getError(timeError: ValidationErrors, dateError: ValidationErrors): string {
    let msg = '';
    if (timeError?.required || dateError?.required) {
      msg = 'Не все поля заполнены';
    }
    if (dateError?.msg) {
      msg = dateError.msg;
    }
    return msg;
  }

  private setDateRangeToStore(values: DateTimePeriodFormValues): void {
    const dateRangeStartDate = {
      min: DatesHelperService.relativeOrFixedToFixed(this.attrs.beginDate.minDate),
      max: DatesHelperService.relativeOrFixedToFixed(this.attrs.beginDate.maxDate),
    };
    const dateRangeEndDate = {
      min: values.startDate,
      max: DatesHelperService.relativeOrFixedToFixed(this.attrs.endDate.maxDate),
    };
    this.dateRestrictionsService.setDateRangeToStore(
      this.component.id,
      dateRangeStartDate,
      undefined,
      'startDate',
    );
    this.dateRestrictionsService.setDateRangeToStore(
      this.component.id,
      dateRangeEndDate,
      undefined,
      'endDate',
    );
  }

  private initStartDate(): Date {
    if (this.initialState && this.initialState.startDateTime) {
      return parseISO(this.initialState.startDateTime);
    }
    return new Date();
  }

  private initStartTime(): ListElement | null {
    if (this.initialState && this.initialState.startDateTime) {
      const timeStr = format(parseISO(this.initialState.startDateTime), this.timeFormat);

      return this.startTimeDropdownItems.find((item) => item.id === timeStr) || null;
    }

    return (
      this.startTimeDropdownItems.find((item) => item.id === this.startTimeInitialValue) || null
    );
  }

  private initEndDate(): Date | null {
    if (this.initialState && this.initialState.endDateTime) {
      return parseISO(this.initialState.endDateTime);
    }
    return null;
  }

  private initEndTime(): ListElement | null {
    if (this.initialState && this.initialState.endDateTime) {
      const timeStr = format(parseISO(this.initialState.endDateTime), this.timeFormat);

      return this.allTimeDropdownItems.find((item) => item.id === timeStr) || null;
    }
    return null;
  }

  private initStartTimeDropdownItems(values: DateTimePeriodFormValues): ListElement[] {
    let timeChunks = getTimeChunksDateObjects(this.step);

    // если начальная и конечная дата заполнены и совпадают, и начальное время заполнено, то
    // список допустимого конечного времени должен быть позже начального
    if (
      values.startDate &&
      values.endDate &&
      values.startTime &&
      isSameDay(values.startDate, values.endDate)
    ) {
      const startTimeObject: Date = getDateTimeObject(
        new Date(),
        values.startTime.id as string,
        this.timeFormat,
      );

      timeChunks = timeChunks.filter((item) => item > startTimeObject);
    }

    // важно сохранить ссылку на объект ListElement, это нужно для корректной работы lib-dropdown
    // поэтому пользуемся элементами из массива allTimeDropdownItems
    return timeChunks
      .map((item) => format(item, this.timeFormat))
      .map((item) => this.allTimeDropdownItems.find((subItem) => subItem.id === item));
  }
}
