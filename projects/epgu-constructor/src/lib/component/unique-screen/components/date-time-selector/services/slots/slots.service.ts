import { Injectable } from '@angular/core';
import { StateService } from '../state/state.service';

import {
  BehaviorSubject,
  combineLatest,
  EMPTY,
  forkJoin,
  Observable,
  Subject,
  throwError,
} from 'rxjs';
import {
  BookTimeSlotReq,
  CancelSlotResponseInterface,
  DepartmentInterface,
  SmevBookResponseInterface,
  TimeSlot,
  TimeSlotReq,
  TimeSlotsAnswerInterface,
  TimeSlotValueInterface,
} from '../../../time-slots/time-slots.types';
import { TimeSlotsTypes } from '../../../time-slots/time-slots.constants';
import {
  DATE_ISO_STRING_FORMAT,
  DATE_STRING_YEAR_MONTH,
  DatesToolsService,
  SessionService,
  TimeSlotsApiItem,
} from '@epgu/epgu-constructor-ui-kit';
import {
  Slot,
  SlotMap,
  TimeSlotAttributes,
  TimeSlotBookRequest,
  TimeSlotRequest,
  TIMEZONE_STR_OFFSET,
} from '../../typings';
import {
  catchError,
  concatMap,
  distinctUntilChanged,
  filter,
  map,
  pluck,
  shareReplay,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { ErrorService, ErrorType } from '../error/error.service';
import { v4 as uuidv4 } from 'uuid';
import { Smev3Service } from '../api/smev3/smev3.service';
import { get } from 'lodash';
import { DictionaryItem } from '../../../../../../shared/services/dictionary/dictionary-api.types';
import { Smev2Service } from '../api/smev2/smev2.service';
import {
  DictionaryConditions,
  DictionaryOptions,
  DictionarySubFilter,
  DictionaryUnionKind,
} from '@epgu/epgu-constructor-types';
import {
  ComponentValue,
  DictionaryToolsService,
} from '../../../../../../shared/services/dictionary/dictionary-tools.service';
import { ScreenService } from '../../../../../../screen/screen.service';
import { JsonHelperService } from '../../../../../../core/services/json-helper/json-helper.service';

export interface CancelOperation {
  slotList: TimeSlotsAnswerInterface[];
  result: BehaviorSubject<CancelSlotResponseInterface[]>;
}
export interface BookOperation {
  book: Slot;
  result: BehaviorSubject<SmevBookResponseInterface>;
}

@Injectable()
export class SlotsService {
  smev2CacheItems: Record<string, DictionaryItem> = {};
  cancel$$ = new Subject<CancelOperation>();

  cancel$ = this.cancel$$.pipe(
    filter((value: CancelOperation) => value.slotList.length > 0),
    concatMap(({ slotList, result }) =>
      combineLatest([this.state.value$, this.state.config$]).pipe(
        take(1),
        tap(() => this.error.reset()),
        concatMap(([data, config]) =>
          forkJoin(
            slotList.map(({ bookId }) =>
              this.api.cancel({
                bookId,
                eserviceId: (data.eserviceId as string) || config.eserviceId,
              }),
            ),
          ).pipe(
            tap((response: CancelSlotResponseInterface[]) => {
              const failedItems = response
                .filter((item) => this.api.hasError(item?.error))
                .map((item) => item.error.errorDetail.errorMessage);

              if (failedItems.length) {
                const error = failedItems.join(', ');
                result.error(error);
                this.error.setError(ErrorType.cancel, error);
                return;
              }
              result.next(response);
              this.state.bookedSlot$$.next(null);
              this.state.bookId$$.next(null);
            }),
            catchError((err) => {
              this.error.setError(ErrorType.cancel, err.message);
              return throwError(err);
            }),
          ),
        ),
      ),
    ),
  );

  book$$ = new Subject<BookOperation>();
  book$ = this.book$$.pipe(
    concatMap(({ book, result }) =>
      combineLatest([
        this.state.bookId$,
        this.state.type$,
        this.state.isBookedDepartment$,
        this.state.waitingTimeExpired$,
        this.state.value$,
        this.state.config$,
        this.state.department$,
        this.state.attributeNameWithAddress$,
        this.state.ignoreRootParams$,
        this.state.timeSlotRequestAttrs$,
        this.state.slotsPeriod$,
        this.state.solemn$,
      ]).pipe(
        take(1),
        tap(() => this.error.reset()),
        concatMap(
          ([
            bookId,
            type,
            isBookedDepartment,
            waitingTimeExpired,
            value,
            config,
            department,
            attributeNameWithAddress,
            ignoreRootParams,
            attributes,
            slotsPeriod,
            solemn,
          ]: [
            string,
            TimeSlotsTypes,
            boolean,
            boolean,
            TimeSlotValueInterface,
            TimeSlotsApiItem,
            DepartmentInterface,
            string,
            string[],
            TimeSlotAttributes,
            string,
            boolean,
          ]) =>
            this.api
              .book(
                this.getBookRequest(
                  book,
                  bookId,
                  isBookedDepartment,
                  waitingTimeExpired,
                  type,
                  value,
                  config,
                  department,
                  attributeNameWithAddress,
                  ignoreRootParams,
                  attributes,
                  slotsPeriod,
                  solemn,
                ),
              )
              .pipe(
                tap((response) => result.next(response)),
                tap(() => this.state.bookedSlot$$.next(book)),
                tap((book) => this.state.bookId$$.next(book.bookId)),
                catchError((err) => {
                  result.error(err);
                  this.error.setError(ErrorType.book, err.message || err.errorDetail.errorMessage);
                  return EMPTY;
                }),
              ),
        ),
      ),
    ),
  );

  availableMonths$$ = new BehaviorSubject<string[]>([]);
  store$ = combineLatest([
    this.state.department$,
    this.state.value$,
    this.state.type$,
    this.state.config$,
    this.state.ignoreRootParams$,
    this.state.timeSlotRequestAttrs$,
    this.state.slotsPeriod$,
    this.state.solemn$,
  ]).pipe(
    distinctUntilChanged(),
    tap(() => this.error.reset()),
    switchMap(
      ([department, data, type, config, ignoreRootParams, attributes, slotsPeriod, solemn]: [
        DepartmentInterface,
        TimeSlotValueInterface,
        TimeSlotsTypes,
        TimeSlotsApiItem,
        string[],
        TimeSlotAttributes,
        string,
        boolean,
      ]) =>
        this.api
          .getList(
            this.createRequest(
              department,
              data,
              type,
              config,
              ignoreRootParams,
              attributes,
              slotsPeriod,
              solemn,
            ),
          )
          .pipe(
            catchError((err) => {
              const { errorMessage, errorCode } = err?.errorDetail;
              this.error.setError(ErrorType.list, errorMessage || errorCode || err.message);
              return throwError(err);
            }),
            map((result: TimeSlot[]) => this.createMap(slotsPeriod, type, result)),
          ),
    ),
    shareReplay(),
  );

  constructor(
    private datesTools: DatesToolsService,
    private state: StateService,
    private api: Smev3Service,
    private smev2: Smev2Service,
    private error: ErrorService,
    private dictionaryTools: DictionaryToolsService,
    private sessionService: SessionService,
    private screenService: ScreenService,
    private jsonHelperService: JsonHelperService,
  ) {}

  getBookRequest(
    slot: Slot,
    bookId: string,
    isBookedDepartment: boolean,
    waitingTimeExpired: boolean,
    type: TimeSlotsTypes,
    data: TimeSlotValueInterface,
    {
      preliminaryReservation,
      serviceId,
      serviceCode,
      subject,
      eserviceId,
      calendarName,
      preliminaryReservationPeriod,
      routeNumber,
    }: TimeSlotsApiItem,
    department: DepartmentInterface,
    attributeNameWithAddress: string,
    ignoreRootParams: string[],
    attributes: TimeSlotAttributes,
    slotsPeriod: string,
    solemn: boolean,
  ): BookTimeSlotReq {
    let nowBookId = bookId;
    if (!bookId || !isBookedDepartment || waitingTimeExpired) {
      nowBookId = uuidv4();
      this.state.bookId$$.next(nowBookId);
    }

    const requestBody: BookTimeSlotReq = {
      preliminaryReservation,
      address: this.getAddress(attributeNameWithAddress, department.attributeValues),
      orgName: department.attributeValues.FULLNAME || department.title,
      routeNumber,
      subject: (data.subject as string) || subject,
      userSelectedRegion: data.userSelectedRegion as string,
      params: (data.bookingRequestParams as TimeSlotAttributes) || [
        {
          name: 'phone',
          value: department.attributeValues.PHONE,
        },
        {
          name: 'userSelectedRegionFromForm',
          value: data.departmentRegion as string,
        },
      ],
      eserviceId: (data.eserviceId as string) || eserviceId,
      serviceCode: (data.serviceCode as string) || serviceCode,
      bookId: nowBookId,
      organizationId: this.getOrganizationId(data, department, type),
      calendarName: (data.calendarName as string) || calendarName,
      areaId: [slot.areaId || ''],
      selectedHallTitle: department.attributeValues.AREA_NAME || slot.slotId,
      parentOrderId: data.orderId as string,
      preliminaryReservationPeriod,
      attributes:
        this.getAttributes(attributes, type, serviceId, data, department, solemn, slotsPeriod) ||
        [],
      slotId: [slot.slotId],
      serviceId: [(data.serviceId as string) || serviceId],
    };

    if ([TimeSlotsTypes.MVD, TimeSlotsTypes.DOCTOR].includes(type)) {
      requestBody.parentOrderId = data.parentOrderId ? (data.parentOrderId as string) : '';
      requestBody.caseNumber = data.orderId ? (data.orderId as string) : '';
    }

    return <BookTimeSlotReq>this.paramsFilter(ignoreRootParams, requestBody);
  }
  getAddress(attributeNameWithAddress: string, attributeValues: { [key: string]: string }): string {
    return (
      attributeValues[attributeNameWithAddress as string] ||
      attributeValues.ADDRESS ||
      attributeValues.ADDRESS_OUT ||
      attributeValues.address
    );
  }

  book(book: Slot): Observable<SmevBookResponseInterface> {
    const operation = {
      book,
      result: new BehaviorSubject(null),
    } as BookOperation;
    this.book$$.next(operation);
    return operation.result.pipe(filter((value) => !!value));
  }

  cancel(
    slotList: TimeSlotsAnswerInterface | TimeSlotsAnswerInterface[],
  ): Observable<CancelSlotResponseInterface[]> {
    const operation = {
      slotList: Array.isArray(slotList) ? slotList : [slotList],
      result: new BehaviorSubject(null),
    } as CancelOperation;
    this.cancel$$.next(operation);
    return operation.result.pipe(filter((value) => !!value));
  }

  createMap(slotsPeriod: string, type: TimeSlotsTypes, slots: TimeSlot[]): SlotMap {
    const result: SlotMap = [];
    let availableMonths: string[] = [];

    slots.forEach((slot) => {
      const slotDate = new Date(slot.visitTimeStr);
      if (!result[slotDate.getFullYear()]) {
        result[slotDate.getFullYear()] = {};
      }

      let monthSlots = result[slotDate.getFullYear()];
      if (!monthSlots[slotDate.getMonth()]) {
        monthSlots[slotDate.getMonth()] = {};
        const month = this.datesTools.format(slotDate, DATE_STRING_YEAR_MONTH);
        availableMonths.push(month);
      }

      if (type === TimeSlotsTypes.BRAK) {
        availableMonths = [slotsPeriod];
      }

      let daySlots = monthSlots[slotDate.getMonth()];
      if (!daySlots[slotDate.getDate()]) {
        daySlots[slotDate.getDate()] = [];
      }

      daySlots[slotDate.getDate()].push({
        slotId: slot.slotId,
        areaId: slot.areaId,
        slotTime: slotDate,
        timezone: slot.visitTimeISO.substr(TIMEZONE_STR_OFFSET),
      });
    });

    this.availableMonths$$.next(availableMonths);
    return result;
  }

  createRequest(
    department: DepartmentInterface,
    data: TimeSlotValueInterface,
    type: TimeSlotsTypes,
    { serviceId, eserviceId, routeNumber }: TimeSlotsApiItem,
    ignoreRootParams: string[],
    attributes: TimeSlotAttributes,
    slotsPeriod: string,
    solemn: boolean,
  ): TimeSlotRequest {
    return <TimeSlotRequest>this.paramsFilter(ignoreRootParams, {
      organizationId: [this.getOrganizationId(data, department, type)],
      caseNumber: this.getCaseNumber(data, type),
      serviceId: [(data.serviceId as string) || serviceId],
      eserviceId: (data.eserviceId as string) || eserviceId,
      routeNumber,
      attributes:
        attributes ??
        this.getAttributes(attributes, type, serviceId, data, department, solemn, slotsPeriod),
    });
  }

  getAttributes(
    attributes: TimeSlotAttributes,
    type: TimeSlotsTypes,
    serviceId: string,
    data: TimeSlotValueInterface,
    department: DepartmentInterface,
    solemn: boolean,
    slotsPeriod: string,
  ): { name: string; value: string }[] {
    const settings = {
      [TimeSlotsTypes.BRAK]: [
        { name: 'SolemnRegistration', value: solemn },
        { name: 'SlotsPeriod', value: slotsPeriod },
      ],
      [TimeSlotsTypes.RAZBRAK]: [],
      [TimeSlotsTypes.MVD]: [],
      [TimeSlotsTypes.GIBDD]: [
        { name: 'organizationId', value: department.attributeValues.code },
        { name: 'serviceId', value: (data.serviceId as string) || serviceId },
      ],
    };

    return settings[type];
  }

  paramsFilter(
    ignoreRootParams: string[],
    request: TimeSlotRequest | TimeSlotBookRequest,
  ): Partial<TimeSlotReq> | Partial<BookTimeSlotReq> {
    const result = { ...request };

    if (ignoreRootParams?.length > 0) {
      ignoreRootParams.forEach((key) => delete result[key]);
    }

    return result;
  }

  getOrganizationId(
    data: TimeSlotValueInterface,
    department: DepartmentInterface,
    type: TimeSlotsTypes,
  ): string {
    const settings = {
      [TimeSlotsTypes.BRAK]: department.attributeValues.CODE,
      [TimeSlotsTypes.RAZBRAK]: department.attributeValues.CODE,
      [TimeSlotsTypes.MVD]: department.value,
      [TimeSlotsTypes.GIBDD]: department.attributeValues.code,
    };

    return (data.organizationId as string) || settings[type];
  }

  getCaseNumber(data: TimeSlotValueInterface, type: TimeSlotsTypes): string {
    return type === TimeSlotsTypes.MVD ? (data.parentOrderId as string) : (data.orderId as string);
  }

  getSlotListByDate(slotMap: SlotMap, date: Date, area: string): Slot[] {
    return get(slotMap, `${date.getFullYear()}.${date.getMonth()}.${date.getDate()}`, []).filter(
      (slot) => slot.areaId === area || !area,
    );
  }

  addBookedTimeSlotToList(bookedSlot: Slot, timeSlots: Slot[]): Slot[] {
    if (
      !bookedSlot ||
      timeSlots.length === 0 ||
      !this.datesTools.isSameDate(bookedSlot?.slotTime, timeSlots[0]?.slotTime)
    ) {
      return timeSlots;
    }

    const result = [...timeSlots];
    const bookedSlotTime = bookedSlot.slotTime?.getTime();
    const insertIdx = result.findIndex((timeSlot, idx) => {
      const prevSlotTime = result[idx - 1]?.slotTime?.getTime();
      const currentSlotTime = timeSlot.slotTime?.getTime();
      return prevSlotTime
        ? bookedSlotTime > prevSlotTime && bookedSlotTime < currentSlotTime
        : bookedSlotTime < currentSlotTime;
    });
    if (insertIdx !== -1) {
      result.splice(insertIdx, 0, bookedSlot);
    } else {
      result.push(bookedSlot);
    }

    return result;
  }

  getSmev2DictionaryOptions(date: Date): DictionaryOptions {
    const filter = this.dictionaryTools.getFilterOptions(
      this.jsonHelperService.tryToParse(
        this.screenService.componentValue as string,
        {},
      ) as ComponentValue,
      this.screenService.getStore(),
      this.screenService.component.attrs?.dictionaryFilter,
    );

    const additionalFilters = filter?.filter?.simple
      ? [filter?.filter as DictionarySubFilter]
      : filter?.filter?.union.subs;

    return {
      treeFiltering: 'ONELEVEL',
      pageNum: 1,
      pageSize: '258',
      filter: {
        union: {
          unionKind: DictionaryUnionKind.AND,
          subs: [
            ...additionalFilters,
            {
              simple: {
                attributeName: 'AppointmentDate',
                condition: DictionaryConditions.EQUALS,
                value: {
                  asString: this.datesTools.format(date, DATE_ISO_STRING_FORMAT),
                },
              },
            },
            {
              simple: {
                attributeName: 'AppointmentDateTo',
                condition: DictionaryConditions.EQUALS,
                value: {
                  asString: this.datesTools.format(
                    this.datesTools.sub(this.datesTools.addDays(date, 1), 1, 'seconds'),
                    DATE_ISO_STRING_FORMAT,
                  ),
                },
              },
            },
            {
              simple: {
                attributeName: 'personSourceSystemID',
                condition: DictionaryConditions.EQUALS,
                value: {
                  asString: this.sessionService.userId,
                },
              },
            },
          ],
        },
      },
      parentRefItemValue: '',
      selectAttributes: ['*'],
      tx: '',
    };
  }

  smev2getSlots(date: Date): Observable<Slot[]> {
    return this.smev2.getList(this.getSmev2DictionaryOptions(date)).pipe(
      pluck('items'),
      tap(() => {
        this.smev2CacheItems = {};
      }),
      map((items: DictionaryItem[]) =>
        items.map((item) => {
          const id = uuidv4();
          this.smev2CacheItems[id] = item;
          return {
            slotId: id,
            slotTime: new Date(item.value),
            timezone: item.value.substr(TIMEZONE_STR_OFFSET),
          } as Slot;
        }),
      ),
    );
  }
}
