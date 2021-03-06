import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  EMPTY,
  forkJoin,
  iif,
  Observable,
  of,
  Subject,
} from 'rxjs';
import {
  catchError,
  concatMap,
  distinctUntilChanged,
  filter,
  finalize,
  map,
  pluck,
  publishReplay,
  refCount,
  startWith,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import {
  DATE_STRING_DASH_FORMAT,
  DATE_STRING_YEAR_MONTH,
  DatesToolsService,
  TimeSlotsApiItem,
} from '@epgu/epgu-constructor-ui-kit';
import { get } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import {
  DictionaryConditions,
  DictionarySubFilter,
  DictionaryUnionKind,
  KeyValueMap,
} from '@epgu/epgu-constructor-types';
import {
  BookOperation,
  CancelFilterProvider,
  CancelOperation,
  CancelSlotResponseInterface,
  DepartmentInterface,
  Slot,
  SlotMap,
  SmevBookResponseInterface,
  TimeSlot,
  TimeSlotAttribute,
  TimeSlotBookRequest,
  TimeSlotRequest,
  TimeSlotRequestType,
  TimeSlotsAnswerInterface,
  TimeSlotValueInterface,
  TIMEZONE_STR_OFFSET,
} from '../../typings';
import { Smev3RestApiService } from '../api/smev3/smev3-rest-api.service';
import { TimeSlotStateService } from '../state/time-slot-state.service';
import { TimeSlotSmev3StateService } from '../smev3-state/time-slot-smev3-state.service';
import { TimeSlotErrorService } from '../error/time-slot-error.service';
import { TimeSlotCalendarService } from '../calendar/time-slot-calendar.service';
import { Invite, InviteService } from '../../../../../../core/services/invite/invite.service';
@Injectable()
export class TimeSlotSmev3Service {
  requestListParams$$ = new BehaviorSubject<Partial<TimeSlotRequest>>(undefined);

  requestBookParams$$ = new BehaviorSubject<Partial<TimeSlotBookRequest>>(undefined);

  reloadStore$$ = new Subject<null>();

  store$ = combineLatest([
    this.smev3.cachedAnswer$,
    this.smev3.value$,
    this.smev3.config$,
    this.smev3.isServiceSpecific$,
    this.smev3.ignoreRootParams$,
    this.smev3.timeSlotRequestAttrs$,
    this.requestListParams$$.pipe(filter((value) => value !== undefined)),
    this.reloadStore$$.pipe(startWith(null)),
  ]).pipe(
    distinctUntilChanged(),
    tap(() => this.calendar.isVisibleDays$$.next(true)),
    tap(() => this.state.startLoaded$$.next(false)),
    switchMap(
      ([cachedAnswer, data, config, isServiceSpecific, ignoreRootParams, attributes, params]: [
        TimeSlotsAnswerInterface,
        TimeSlotValueInterface,
        TimeSlotsApiItem,
        boolean,
        string[],
        TimeSlotAttribute[],
        Partial<TimeSlotRequest>,
        null,
      ]) =>
        this.invite.getFilter(this.getParentOrderId(data), cachedAnswer?.timeSlot?.slotId).pipe(
          switchMap((invite) =>
            this.api
              .getList(
                this.createRequest(data, config, ignoreRootParams, attributes, params, invite),
                isServiceSpecific,
              )
              .pipe(
                catchError(() => {
                  this.calendar.isVisibleDays$$.next(false);
                  return of([]);
                }),
                finalize(() => this.state.startLoaded$$.next(true)),
              ),
          ),
        ),
    ),
    map((result: TimeSlot[]) => this.createMap(result)),
    publishReplay(1),
    refCount(),
  );

  bookId$$ = new BehaviorSubject<string>(this.smev3.cachedAnswer$$.getValue()?.bookId || null);

  bookId$ = this.bookId$$.asObservable();

  isBookedDepartment$$ = new BehaviorSubject<boolean>(null);

  isBookedDepartment$: Observable<boolean> = combineLatest([
    this.isBookedDepartment$$,
    this.smev3.cachedAnswer$,
    this.smev3.department$,
  ]).pipe(
    map(([isBookedDepartment, cachedAnswer, department]) =>
      isBookedDepartment !== null
        ? isBookedDepartment
        : this.isBookedDepartment(cachedAnswer, department),
    ),
  );

  bookedSlot$$ = new BehaviorSubject<Slot>(null);

  bookedSlot$ = combineLatest([
    this.smev3.waitingTimeExpired$,
    this.smev3.cachedAnswer$.pipe(pluck('timeSlot')),
    this.bookedSlot$$,
  ]).pipe(
    distinctUntilChanged(([prevWait, prevSlot, prevBooked], [nextWait, nextSlot, nextBooked]) => {
      return (
        prevWait === nextWait &&
        prevSlot?.slotId === nextSlot?.slotId &&
        prevBooked?.slotId === nextBooked?.slotId
      );
    }),
    map(
      ([waitingTimeExpired, timeSlot, bookedSlot]) =>
        bookedSlot ?? (!waitingTimeExpired && !!timeSlot ? this.createSlot(timeSlot) : null),
    ),
  );

  get area$(): Observable<string> {
    return this.area$$.pipe(distinctUntilChanged());
  }

  set area(area: string) {
    this.area$$.next(area);
  }

  get area(): string {
    return this.area$$.getValue();
  }

  slotsForCancelFilterProvider$$ = new BehaviorSubject<CancelFilterProvider>(
    ((item, waitingTimeExpired, department) =>
      item &&
      (!this.isBookedDepartment(item, department) || waitingTimeExpired)) as CancelFilterProvider,
  );

  slotsForCancel$ = combineLatest([
    this.smev3.cancelList$,
    this.smev3.department$,
    this.smev3.waitingTimeExpired$,
    this.slotsForCancelFilterProvider$$,
  ]).pipe(
    map(([list, department, waitingTimeExpired, filterProvider]) =>
      list
        .filter((item) => !!item)
        .filter((item) => filterProvider(item, waitingTimeExpired, department)),
    ),
    publishReplay(1),
    refCount(),
  );

  cancel$$ = new Subject<CancelOperation>();

  cancel$ = this.cancel$$.pipe(
    tap(() => this.state.progressStart()),
    concatMap(({ slotList, result }) =>
      iif(
        () => slotList.length > 0,
        combineLatest([this.smev3.value$, this.smev3.config$, this.smev3.isServiceSpecific$]).pipe(
          take(1),
          concatMap(([data, config, isServiceSpecific]) =>
            forkJoin(
              slotList.map(({ bookId }) =>
                this.api
                  .cancel(
                    {
                      bookId,
                      eserviceId: (data.eserviceId as string) || config.eserviceId,
                    },
                    isServiceSpecific,
                  )
                  .pipe(catchError((err) => of(err))),
              ),
            ).pipe(
              tap((response: CancelSlotResponseInterface[]) => {
                const failedItems = response
                  .filter((item) => this.api.hasError(item?.error))
                  .map((item) => item.error.errorDetail.errorMessage);

                if (failedItems.length) {
                  const error = failedItems.join(', ');
                  result.error(error);
                  this.error.setError(TimeSlotRequestType.cancel, error);
                }
                result.next(response);
                result.complete();
                this.bookedSlot$$.next(null);
                this.bookId$$.next(null);
              }),
            ),
          ),
        ),
        of(null).pipe(
          tap(() => {
            result.next([]);
            result.complete();
          }),
        ),
      ),
    ),
    tap(() => this.state.progressEnd()),
  );

  book$$ = new Subject<BookOperation>();

  book$ = this.book$$.pipe(
    tap(() => this.state.progressStart()),
    concatMap(({ book, result }: BookOperation) =>
      combineLatest([
        this.bookId$,
        this.isBookedDepartment$,
        this.smev3.waitingTimeExpired$,
        this.smev3.value$,
        this.smev3.config$,
        this.smev3.isServiceSpecific$,
        this.smev3.department$,
        this.smev3.attributeNameWithAddress$,
        this.smev3.ignoreRootParams$,
        this.smev3.bookAttributes$,
        this.requestBookParams$$.pipe(filter((value) => value !== undefined)),
        this.smev3.IsFinalReservation$,
      ]).pipe(
        take(1),
        concatMap(
          ([
            bookId,
            isBookedDepartment,
            waitingTimeExpired,
            value,
            config,
            isServiceSpecific,
            department,
            attributeNameWithAddress,
            ignoreRootParams,
            attributes,
            params,
            IsFinalReservation,
          ]: [
            string,
            boolean,
            boolean,
            TimeSlotValueInterface,
            TimeSlotsApiItem,
            boolean,
            DepartmentInterface,
            string,
            string[],
            TimeSlotAttribute[],
            Partial<TimeSlotBookRequest>,
            boolean,
          ]) =>
            this.api
              .book(
                this.getBookRequest(
                  book,
                  bookId,
                  isBookedDepartment,
                  waitingTimeExpired,
                  value,
                  config,
                  department,
                  attributeNameWithAddress,
                  ignoreRootParams,
                  attributes,
                  params,
                  IsFinalReservation,
                ),
                isServiceSpecific,
              )
              .pipe(
                catchError((err) => {
                  this.state.progressEnd();
                  result.error(err);
                  return EMPTY;
                }),
                tap((response) => result.next(response)),
                tap(() => this.bookedSlot$$.next(book)),
                tap((bookItem) => this.bookId$$.next(bookItem.bookId)),
              ),
        ),
      ),
    ),
    tap(() => this.state.progressEnd()),
  );

  private area$$ = new BehaviorSubject<string>(null);

  constructor(
    private datesTools: DatesToolsService,
    private api: Smev3RestApiService,
    private state: TimeSlotStateService,
    private smev3: TimeSlotSmev3StateService,
    private error: TimeSlotErrorService,
    private calendar: TimeSlotCalendarService,
    private invite: InviteService,
  ) {}

  reloadStore(): void {
    this.reloadStore$$.next();
  }

  getBookRequest(
    slot: Slot,
    bookId: string,
    isBookedDepartment: boolean,
    waitingTimeExpired: boolean,
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
    attributes: TimeSlotAttribute[],
    params: Partial<TimeSlotBookRequest>,
    IsFinalReservation: boolean,
  ): TimeSlotBookRequest {
    let nowBookId = bookId;
    if (!bookId || !isBookedDepartment || waitingTimeExpired) {
      nowBookId = uuidv4();
      this.bookId$$.next(nowBookId);
    }

    const result: TimeSlotBookRequest = {
      preliminaryReservation,
      address: this.getAddress(attributeNameWithAddress, department.attributeValues),
      orgName: (department.attributeValues.FULLNAME || department.title) as string,
      routeNumber,
      subject: (data.subject as string) || subject,
      userSelectedRegion: data.userSelectedRegion as string,
      params: (data.bookingRequestParams as TimeSlotAttribute[]) || [
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
      organizationId: data.organizationId as string,
      calendarName: (data.calendarName as string) || calendarName,
      areaId: [slot?.areaId || ''],
      selectedHallTitle: (department.attributeValues.AREA_NAME || slot?.slotId) as string,
      parentOrderId: data.orderId as string,
      preliminaryReservationPeriod,
      attributes: attributes || [],
      slotId: [slot?.slotId],
      serviceId: [(data.serviceId as string) || serviceId],
    };

    if (!IsFinalReservation) {
      result.preliminaryReservationPeriod = preliminaryReservationPeriod;
      result.preliminaryReservation = preliminaryReservation;
    } else {
      result.preliminaryReservation = 'false';
    }

    return this.paramsFilter(
      ignoreRootParams,
      params
        ? {
            ...result,
            ...params,
            attributes: params?.attributes ?? attributes ?? [],
          }
        : result,
    );
  }

  getParentOrderId(data: TimeSlotValueInterface): string {
    return (
      this.requestBookParams$$.getValue()?.parentOrderId ||
      data?.parentOrderId ||
      (data?.orderId as string)
    );
  }

  getAddress(attributeNameWithAddress: string, attributeValues: KeyValueMap): string {
    return (attributeValues[attributeNameWithAddress as string] ||
      attributeValues.ADDRESS ||
      attributeValues.ADDRESS_OUT ||
      attributeValues.address) as string;
  }

  book(book: Slot): Observable<SmevBookResponseInterface> {
    const operation = {
      status: false,
      book,
      result: new BehaviorSubject(null),
    } as BookOperation;
    return operation.result.pipe(
      tap(() => {
        if (!operation.status) {
          operation.status = true;
          this.book$$.next(operation);
        }
      }),
      filter((value) => !!value),
      take(1),
    );
  }

  cancel(
    slotList: TimeSlotsAnswerInterface | TimeSlotsAnswerInterface[],
  ): Observable<CancelSlotResponseInterface[]> {
    const operation = {
      status: false,
      slotList: Array.isArray(slotList) ? slotList : [slotList],
      result: new BehaviorSubject(null),
    } as CancelOperation;

    return operation.result.pipe(
      tap(() => {
        if (!operation.status) {
          operation.status = true;
          this.cancel$$.next(operation);
        }
      }),
      filter((value) => !!value),
      take(1),
    );
  }

  createSlot(slot: TimeSlot): Slot {
    return {
      slotId: slot.slotId,
      slotTime: new Date(slot.visitTimeISO),
      timezone: slot.visitTimeISO.substr(TIMEZONE_STR_OFFSET),
      areaId: slot.areaId,
    };
  }

  createMap(slots: TimeSlot[]): SlotMap {
    const result: SlotMap = {};
    const availableMonths: string[] = [];

    slots.forEach((slot) => {
      const slotDate = new Date(slot.visitTimeStr);
      if (!result[slotDate.getFullYear()]) {
        result[slotDate.getFullYear()] = {};
      }

      const monthSlots = result[slotDate.getFullYear()];
      if (!monthSlots[slotDate.getMonth()]) {
        monthSlots[slotDate.getMonth()] = {};
        const month = this.datesTools.format(slotDate, DATE_STRING_YEAR_MONTH);
        availableMonths.push(month);
      }

      const daySlots = monthSlots[slotDate.getMonth()];
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

    this.state.months = [...availableMonths];

    return result;
  }

  setInviteToRequest(options: TimeSlotRequest, invite: Invite): TimeSlotRequest {
    const result = { ...options };

    const subs: DictionarySubFilter[] = [];

    if (invite?.startDate) {
      subs.push(({
        simple: {
          attributeName: 'DATE',
          condition: DictionaryConditions.GREATER_THAN_OR_EQUALS,
          value: this.datesTools.format(new Date(invite.startDate), DATE_STRING_DASH_FORMAT),
          checkAllValues: true,
        },
      } as unknown) as DictionarySubFilter);
    }

    if (invite?.endDate) {
      subs.push(({
        simple: {
          attributeName: 'DATE',
          condition: DictionaryConditions.LESS_THAN_OR_EQUALS,
          value: this.datesTools.format(new Date(invite.endDate), DATE_STRING_DASH_FORMAT),
          checkAllValues: true,
        },
      } as unknown) as DictionarySubFilter);
    }
    if (subs?.length) {
      result.filter = {
        union: { unionKind: DictionaryUnionKind.AND, subs },
      };
    }
    if (invite?.organizations?.length > 0 && result?.organizationId) {
      let areas: string[] = [];
      invite?.organizations.forEach((organization) => {
        if (Array.isArray(result.organizationId)) {
          if (result.organizationId.includes(organization.orgId)) {
            areas = areas.concat(organization.areas);
          }
        } else {
          if (result.organizationId === organization.orgId) {
            areas = areas.concat(organization.areas);
          }
        }
      });
      if (areas.length > 0) {
        result.areaId = areas.filter((value, index, self) => self.indexOf(value) === index);
      }
    }
    return result;
  }

  createRequest(
    data: TimeSlotValueInterface,
    { serviceId, eserviceId, routeNumber }: TimeSlotsApiItem,
    ignoreRootParams: string[],
    attributes: TimeSlotAttribute[],
    params: Partial<TimeSlotRequest>,
    invite: Invite,
  ): TimeSlotRequest {
    const base = {
      organizationId: [data.organizationId as string],
      caseNumber: data.orderId,
      serviceId: [(data.serviceId as string) || serviceId],
      eserviceId: (data.eserviceId as string) || eserviceId,
      routeNumber,
      attributes: attributes ?? [],
    };

    const result: TimeSlotRequest = params
      ? { ...base, ...params, attributes: params?.attributes ?? attributes ?? [] }
      : base;

    return <TimeSlotRequest>(
      this.paramsFilter(ignoreRootParams, this.setInviteToRequest(result, invite))
    );
  }

  paramsFilter(
    ignoreRootParams: string[],
    request: TimeSlotRequest | TimeSlotBookRequest,
  ): Partial<TimeSlotRequest> | Partial<TimeSlotBookRequest> {
    const result = { ...request };

    if (ignoreRootParams?.length > 0) {
      ignoreRootParams.forEach((key) => delete result[key]);
    }

    return result;
  }

  getSlotListByDate(slotMap: SlotMap, date: Date): Slot[] {
    return get(slotMap, `${date.getFullYear()}.${date.getMonth()}.${date.getDate()}`, []);
  }

  addBookedTimeSlotToList(bookedSlot: Slot, slotList: Slot[]): Slot[] {
    if (
      !bookedSlot ||
      slotList.length === 0 ||
      !this.datesTools.isSameDate(bookedSlot?.slotTime, slotList[0]?.slotTime) ||
      slotList.findIndex((slot) => slot?.slotId === bookedSlot?.slotId) !== -1
    ) {
      return slotList;
    }

    const result = [...slotList];
    const bookedSlotTime = bookedSlot.slotTime?.getTime();
    const insertIndex = result.findIndex((timeSlot, index) => {
      const prevSlotTime = result[index - 1]?.slotTime?.getTime();
      const currentSlotTime = timeSlot.slotTime?.getTime();
      return prevSlotTime
        ? bookedSlotTime > prevSlotTime && bookedSlotTime < currentSlotTime
        : bookedSlotTime < currentSlotTime;
    });
    if (insertIndex !== -1) {
      result.splice(insertIndex, 0, bookedSlot);
    } else {
      result.push(bookedSlot);
    }

    return result;
  }

  isBookedDepartment(
    cachedAnswer: TimeSlotsAnswerInterface,
    department: DepartmentInterface,
  ): boolean {
    return (
      cachedAnswer?.department.value === department.value &&
      cachedAnswer?.department.attributeValues?.AREA_NAME == department.attributeValues?.AREA_NAME
    );
  }

  clearMessage(message: string): string {
    return message
      .replace('FAILURE:', '')
      .replace('UNKNOWN_REQUEST_DESCRIPTION:', '')
      .replace('NO_DATA:', '');
  }
}
