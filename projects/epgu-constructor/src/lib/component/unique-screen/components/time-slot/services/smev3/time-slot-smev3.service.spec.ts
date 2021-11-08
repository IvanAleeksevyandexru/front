import { TestBed } from '@angular/core/testing';
import { TimeSlotSmev3Service } from './time-slot-smev3.service';
import {
  ConfigService,
  ConfigServiceStub,
  DatesToolsService,
  DatesToolsServiceStub,
  ModalService,
  ModalServiceStub,
} from '@epgu/epgu-constructor-ui-kit';
import { Smev3RestApiService } from '../api/smev3/smev3-rest-api.service';
import { Smev3RestApiServiceStub } from '../api/smev3/smev3-rest-api.service.stub';
import { TimeSlotCalendarService } from '../calendar/time-slot-calendar.service';
import { TimeSlotCalendarServiceStub } from '../calendar/time-slot-calendar.service.stub';
import { TimeSlotStateService } from '../state/time-slot-state.service';

import { TimeSlotSmev3StateService } from '../smev3-state/time-slot-smev3-state.service';

import { TimeSlotErrorService } from '../error/time-slot-error.service';
import { TimeSlotErrorServiceStub } from '../error/time-slot-error.service.stub';
import { JsonHelperService } from '../../../../../../core/services/json-helper/json-helper.service';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';

import {
  CancelSlotResponseInterface,
  DepartmentInterface,
  SmevBookResponseInterface,
  TimeSlot,
  TimeSlotRequest,
  TimeSlotsAnswerInterface,
  TimeSlotValueInterface,
  TIMEZONE_STR_OFFSET,
} from '../../typings';
import { ComponentDto } from '@epgu/epgu-constructor-types';
import { of } from 'rxjs';
import { CurrentAnswersServiceStub } from '../../../../../../screen/current-answers-service.stub';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { isSameDay } from 'date-fns';

const mockTimeSlotValue = {
  timeSlotType: 'BRAK',
  organizationId: 'test',
  department: {
    value: 'R7700005',
    parentValue: null,
    title: 'Гагаринский отдел ЗАГС Управления ЗАГС Москвы',
    isLeaf: true,
    children: null,
    attributes: [
      {
        name: 'ZAGS_NAME',
        type: 'STRING',
        value: {
          asString: 'Гагаринский отдел ЗАГС Управления ЗАГС Москвы',
          asLong: null,
          asDecimal: null,
          asDateTime: null,
          asDate: null,
          asBoolean: null,
          typeOfValue: 'STRING',
          value: 'Гагаринский отдел ЗАГС Управления ЗАГС Москвы',
        },
        valueAsOfType: 'Гагаринский отдел ЗАГС Управления ЗАГС Москвы',
      },
      {
        name: 'zags_address',
        type: 'STRING',
        value: {
          asString: 'Российская Федерация, г. Москва, пр-кт. Ленинский, д. 44',
          asLong: null,
          asDecimal: null,
          asDateTime: null,
          asDate: null,
          asBoolean: null,
          typeOfValue: 'STRING',
          value: 'Российская Федерация, г. Москва, пр-кт. Ленинский, д. 44',
        },
        valueAsOfType: 'Российская Федерация, г. Москва, пр-кт. Ленинский, д. 44',
      },
      {
        name: 'TYPE',
        type: 'STRING',
        value: {
          asString: 'ZAGS',
          asLong: null,
          asDecimal: null,
          asDateTime: null,
          asDate: null,
          asBoolean: null,
          typeOfValue: 'STRING',
          value: 'ZAGS',
        },
        valueAsOfType: 'ZAGS',
      },
      {
        name: 'SHOW_ON_MAP',
        type: 'STRING',
        value: {
          asString: 'true',
          asLong: null,
          asDecimal: null,
          asDateTime: null,
          asDate: null,
          asBoolean: null,
          typeOfValue: 'STRING',
          value: 'true',
        },
        valueAsOfType: 'true',
      },
      {
        name: 'SOLEMN',
        type: 'STRING',
        value: {
          asString: 'true',
          asLong: null,
          asDecimal: null,
          asDateTime: null,
          asDate: null,
          asBoolean: null,
          typeOfValue: 'STRING',
          value: 'true',
        },
        valueAsOfType: 'true',
      },
      {
        name: 'AREA_DESCR',
        type: 'STRING',
        value: {
          asString: null,
          asLong: null,
          asDecimal: null,
          asDateTime: null,
          asDate: null,
          asBoolean: null,
          typeOfValue: 'STRING',
          value: null,
        },
        valueAsOfType: null,
      },
      {
        name: 'DATAK',
        type: 'STRING',
        value: {
          asString: null,
          asLong: null,
          asDecimal: null,
          asDateTime: null,
          asDate: null,
          asBoolean: null,
          typeOfValue: 'STRING',
          value: null,
        },
        valueAsOfType: null,
      },
      {
        name: 'AREA_NAME',
        type: 'STRING',
        value: {
          asString: null,
          asLong: null,
          asDecimal: null,
          asDateTime: null,
          asDate: null,
          asBoolean: null,
          typeOfValue: 'STRING',
          value: null,
        },
        valueAsOfType: null,
      },
      {
        name: 'CODE',
        type: 'STRING',
        value: {
          asString: 'R7700005',
          asLong: null,
          asDecimal: null,
          asDateTime: null,
          asDate: null,
          asBoolean: null,
          typeOfValue: 'STRING',
          value: 'R7700005',
        },
        valueAsOfType: 'R7700005',
      },
      {
        name: 'FULLNAME',
        type: 'STRING',
        value: {
          asString: 'Гагаринский отдел ЗАГС Управления ЗАГС Москвы',
          asLong: null,
          asDecimal: null,
          asDateTime: null,
          asDate: null,
          asBoolean: null,
          typeOfValue: 'STRING',
          value: 'Гагаринский отдел ЗАГС Управления ЗАГС Москвы',
        },
        valueAsOfType: 'Гагаринский отдел ЗАГС Управления ЗАГС Москвы',
      },
      {
        name: 'ADDRESS',
        type: 'STRING',
        value: {
          asString: 'Российская Федерация, г. Москва, пр-кт. Ленинский, д. 44',
          asLong: null,
          asDecimal: null,
          asDateTime: null,
          asDate: null,
          asBoolean: null,
          typeOfValue: 'STRING',
          value: 'Российская Федерация, г. Москва, пр-кт. Ленинский, д. 44',
        },
        valueAsOfType: 'Российская Федерация, г. Москва, пр-кт. Ленинский, д. 44',
      },
      {
        name: 'PHONE',
        type: 'STRING',
        value: {
          asString: '8(499)137-32-42',
          asLong: null,
          asDecimal: null,
          asDateTime: null,
          asDate: null,
          asBoolean: null,
          typeOfValue: 'STRING',
          value: '8(499)137-32-42',
        },
        valueAsOfType: '8(499)137-32-42',
      },
      {
        name: 'EMAIL',
        type: 'STRING',
        value: {
          asString: 'zags@mos.ru',
          asLong: null,
          asDecimal: null,
          asDateTime: null,
          asDate: null,
          asBoolean: null,
          typeOfValue: 'STRING',
          value: 'zags@mos.ru',
        },
        valueAsOfType: 'zags@mos.ru',
      },
      {
        name: 'PR2',
        type: 'STRING',
        value: {
          asString: 'true',
          asLong: null,
          asDecimal: null,
          asDateTime: null,
          asDate: null,
          asBoolean: null,
          typeOfValue: 'STRING',
          value: 'true',
        },
        valueAsOfType: 'true',
      },
      {
        name: 'GET_CONSENT',
        type: 'STRING',
        value: {
          asString: null,
          asLong: null,
          asDecimal: null,
          asDateTime: null,
          asDate: null,
          asBoolean: null,
          typeOfValue: 'STRING',
          value: null,
        },
        valueAsOfType: null,
      },
      {
        name: 'PR1',
        type: 'STRING',
        value: {
          asString: 'true',
          asLong: null,
          asDecimal: null,
          asDateTime: null,
          asDate: null,
          asBoolean: null,
          typeOfValue: 'STRING',
          value: 'true',
        },
        valueAsOfType: 'true',
      },
      {
        name: 'PR3',
        type: 'STRING',
        value: {
          asString: 'true',
          asLong: null,
          asDecimal: null,
          asDateTime: null,
          asDate: null,
          asBoolean: null,
          typeOfValue: 'STRING',
          value: 'true',
        },
        valueAsOfType: 'true',
      },
      {
        name: 'PR4',
        type: 'STRING',
        value: {
          asString: 'true',
          asLong: null,
          asDecimal: null,
          asDateTime: null,
          asDate: null,
          asBoolean: null,
          typeOfValue: 'STRING',
          value: 'true',
        },
        valueAsOfType: 'true',
      },
      {
        name: 'PR5',
        type: 'STRING',
        value: {
          asString: 'true',
          asLong: null,
          asDecimal: null,
          asDateTime: null,
          asDate: null,
          asBoolean: null,
          typeOfValue: 'STRING',
          value: 'true',
        },
        valueAsOfType: 'true',
      },
      {
        name: 'PR6',
        type: 'STRING',
        value: {
          asString: 'true',
          asLong: null,
          asDecimal: null,
          asDateTime: null,
          asDate: null,
          asBoolean: null,
          typeOfValue: 'STRING',
          value: 'true',
        },
        valueAsOfType: 'true',
      },
      {
        name: 'PR7',
        type: 'STRING',
        value: {
          asString: 'true',
          asLong: null,
          asDecimal: null,
          asDateTime: null,
          asDate: null,
          asBoolean: null,
          typeOfValue: 'STRING',
          value: 'true',
        },
        valueAsOfType: 'true',
      },
      {
        name: 'PR10',
        type: 'STRING',
        value: {
          asString: 'true',
          asLong: null,
          asDecimal: null,
          asDateTime: null,
          asDate: null,
          asBoolean: null,
          typeOfValue: 'STRING',
          value: 'true',
        },
        valueAsOfType: 'true',
      },
      {
        name: 'PR8',
        type: 'STRING',
        value: {
          asString: 'false',
          asLong: null,
          asDecimal: null,
          asDateTime: null,
          asDate: null,
          asBoolean: null,
          typeOfValue: 'STRING',
          value: 'false',
        },
        valueAsOfType: 'false',
      },
      {
        name: 'PR9',
        type: 'STRING',
        value: {
          asString: 'true',
          asLong: null,
          asDecimal: null,
          asDateTime: null,
          asDate: null,
          asBoolean: null,
          typeOfValue: 'STRING',
          value: 'true',
        },
        valueAsOfType: 'true',
      },
    ],
    source: null,
    attributeValues: {
      ZAGS_NAME: 'Гагаринский отдел ЗАГС Управления ЗАГС Москвы',
      PR10: 'true',
      AREA_NAME: null,
      PHONE: '8(499)137-32-42',
      SOLEMN: 'true',
      zags_address: 'Российская Федерация, г. Москва, пр-кт. Ленинский, д. 44',
      EMAIL: 'zags@mos.ru',
      GET_CONSENT: null,
      PR1: 'true',
      PR3: 'true',
      PR2: 'true',
      CODE: 'R7700005',
      PR5: 'true',
      PR4: 'true',
      PR7: 'true',
      PR6: 'true',
      SHOW_ON_MAP: 'true',
      PR9: 'true',
      ADDRESS: 'Российская Федерация, г. Москва, пр-кт. Ленинский, д. 44',
      PR8: 'false',
      DATAK: null,
      TYPE: 'ZAGS',
      AREA_DESCR: null,
      FULLNAME: 'Гагаринский отдел ЗАГС Управления ЗАГС Москвы',
    },
    objectId: 13,
    center: [37.567159, 55.701318],
    baloonContent: [
      { value: 'Российская Федерация, г. Москва, пр-кт. Ленинский, д. 44', label: 'Адрес' },
      { value: '8(499)137-32-42', label: 'Телефон' },
      { value: 'zags@mos.ru', label: 'Email' },
    ],
    agreement: true,
    idForMap: 13,
    expanded: true,
    okato: '45000000000',
  },
  solemn: 'Да',
  slotsPeriod: {
    children: [],
    attributeValues: {},
    attributes: [],
    source: null,
    parentValue: null,
    title: 'Октябрь 2021',
    value: '2021-10-01',
    isLeaf: true,
  },
  orderId: 1485144134,
  userId: '1000415878',
  waitingTimeExpired: false,
};

const mockComponent = ({
  id: 'idComponent',
  type: 'TimeSlot',
  attrs: {
    attributeNameWithAddress: 'zags_address',
    cancelReservation: ['res'],
    ignoreRootParams: ['attr'],
    bookingErrorHandling: [{ errorCode: '1' }],
    slotsNotFoundTemplate: {
      header: 't',
    },
  },
} as unknown) as ComponentDto;

const createMockSlot = (date: string) => {
  return {
    slotId: 'e3758564-bf72-4bc3-be55-b6c4e3195427',
    areaId: 'Дом музыки',
    slotTime: new Date(date),
    timezone: 'T08:00',
  };
};

const slots = [
  {
    slotId: 'e3758564-bf72-4bc3-be55-b6c4e3195427',
    serviceId: '10000000000456',
    organizationId: 'R7700005',
    areaId: 'Дом музыки',
    visitTime: 1584691200000,
    visitTimeStr: '2020-03-21T08:00:00.000',
    visitTimeISO: '2020-03-21T08:00',
  } as TimeSlot,
  {
    slotId: 'a7164f5b-c5d6-4d47-9478-dcab86882695',
    serviceId: '10000000000456',
    organizationId: 'R7700005',
    areaId: 'Кабинет отдела',
    visitTime: 1616234400000,
    visitTimeStr: '2021-03-20T10:00:00.000',
    visitTimeISO: '2021-03-20T10:00',
  } as TimeSlot,
];

const mockMap = {
  2020: {
    2: {
      21: [
        {
          slotId: slots[0].slotId,
          areaId: slots[0].areaId,
          slotTime: new Date(slots[0].visitTimeISO),
          timezone: slots[0].visitTimeISO.substr(TIMEZONE_STR_OFFSET),
        },
      ],
    },
  },
  2021: {
    2: {
      20: [
        {
          slotId: slots[1].slotId,
          areaId: slots[1].areaId,
          slotTime: new Date(slots[1].visitTimeISO),
          timezone: slots[1].visitTimeISO.substr(TIMEZONE_STR_OFFSET),
        },
      ],
    },
  },
};

export const mockAnswer = ({
  department: mockTimeSlotValue.department,
} as unknown) as TimeSlotsAnswerInterface;

describe('TimeSlotSmev3Service', () => {
  let service: TimeSlotSmev3Service;
  let screenService: ScreenService;
  let configService: ConfigService;
  let smev3StateService: TimeSlotSmev3StateService;
  let apiService: Smev3RestApiService;
  let dateService: DatesToolsService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TimeSlotSmev3Service,
        TimeSlotSmev3StateService,
        { provide: DatesToolsService, useClass: DatesToolsServiceStub },
        { provide: Smev3RestApiService, useClass: Smev3RestApiServiceStub },
        { provide: TimeSlotCalendarService, useClass: TimeSlotCalendarServiceStub },
        { provide: TimeSlotErrorService, useClass: TimeSlotErrorServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: CurrentAnswersService, useClass: CurrentAnswersServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        JsonHelperService,
        TimeSlotStateService,
      ],
    });
    screenService = TestBed.inject(ScreenService);
    configService = TestBed.inject(ConfigService);
    jest.spyOn(screenService, 'componentValue$', 'get').mockReturnValue(of(mockTimeSlotValue));
    jest.spyOn(screenService, 'component$', 'get').mockReturnValue(of(mockComponent));
    jest
      .spyOn(screenService, 'getCompValueFromCachedAnswers')
      .mockReturnValue(JSON.stringify(mockAnswer));
    smev3StateService = TestBed.inject(TimeSlotSmev3StateService);
    smev3StateService.cachedAnswer$ = of(mockAnswer);
    smev3StateService.department$ = of(mockTimeSlotValue.department as DepartmentInterface);
    dateService = TestBed.inject(DatesToolsService);
    jest
      .spyOn(dateService, 'isSameDate')
      .mockImplementation((left: Date, right: Date) => isSameDay(left, right));
    service = TestBed.inject(TimeSlotSmev3Service);
    apiService = TestBed.inject(Smev3RestApiService);
  });

  describe('base', () => {
    it('should be clearMessage', () => {
      expect(service.clearMessage('FAILURE:1UNKNOWN_REQUEST_DESCRIPTION:1NO_DATA:1')).toBe('111');
    });

    it('should be isBookedDepartment', () => {
      expect(service.isBookedDepartment(mockAnswer, mockAnswer.department)).toBe(true);
    });

    it('should be getSlotListByDate', () => {
      expect(service.getSlotListByDate(mockMap, new Date('2021-03-20'))).toBe(
        mockMap['2021']['2']['20'],
      );
    });

    it('should be paramsFilter', () => {
      expect(
        service.paramsFilter(['attr', 'attr2'], {
          attr: 1,
          attr2: 1,
          test: true,
        } as TimeSlotRequest),
      ).toEqual({ test: true });
    });

    it('should be createMap', () => {
      expect(service.createMap(slots)).toEqual(mockMap);
    });

    it('should be createSlot', () => {
      const slot = slots[0];
      expect(service.createSlot(slot)).toEqual({
        areaId: slot.areaId,
        slotId: slot.slotId,
        slotTime: new Date(slot.visitTimeISO),
        timezone: slot.visitTimeISO.substr(TIMEZONE_STR_OFFSET),
      });
    });

    it('should be getAddress', () => {
      expect(service.getAddress('test', { test: 'address' })).toBe('address');
      expect(service.getAddress(null, { address: 'address' })).toBe('address');
      expect(service.getAddress(null, { ADDRESS_OUT: 'address' })).toBe('address');
      expect(service.getAddress(null, { ADDRESS: 'address' })).toBe('address');
    });

    it('should be reloadStore', () => {
      jest.spyOn(service.reloadStore$$, 'next');
      service.reloadStore();
      expect(service.reloadStore$$.next).toHaveBeenCalled();
    });
    it('should be cancel', (done) => {
      const sub = service.cancel$.subscribe();
      const cancelItem = { bookId: '123' } as TimeSlotsAnswerInterface;
      const test = ({ test: true } as unknown) as CancelSlotResponseInterface;
      jest.spyOn(apiService, 'cancel').mockReturnValue(of(test));
      service.cancel([cancelItem, cancelItem]).subscribe((result) => {
        expect(result).toEqual([test, test]);
        sub.unsubscribe();
        done();
      });
    });
    it('should be isBookedDepartment$ with param', (done) => {
      service.isBookedDepartment$$.next(true);
      service.isBookedDepartment$.subscribe((value) => {
        expect(value).toBe(true);
        done();
      });
    });
    it('should be isBookedDepartment$ without param', (done) => {
      service.isBookedDepartment$$.next(null);
      service.isBookedDepartment$.subscribe((value) => {
        expect(value).toBe(true);
        done();
      });
    });
  });

  describe('addBookedTimeSlotToList', () => {
    it('should be check notChanged', () => {
      const slot = mockMap['2021']['2']['20'][0];
      expect(service.addBookedTimeSlotToList(slot, [])).toEqual([]);
      expect(service.addBookedTimeSlotToList(null, [])).toEqual([]);
      expect(
        service.addBookedTimeSlotToList(createMockSlot('2021-03-21T08:00:00.000Z'), [slot]),
      ).toEqual([slot]);
    });
    it('should be added to place', () => {
      expect(
        service.addBookedTimeSlotToList(createMockSlot('2021-03-20T10:00:00.000Z'), [
          createMockSlot('2021-03-20T08:00:00.000Z'),
          createMockSlot('2021-03-20T11:00:00.000Z'),
        ]),
      ).toEqual([
        createMockSlot('2021-03-20T08:00:00.000Z'),
        createMockSlot('2021-03-20T10:00:00.000Z'),
        createMockSlot('2021-03-20T11:00:00.000Z'),
      ]);
    });
    it('should be added to end', () => {
      expect(
        service.addBookedTimeSlotToList(createMockSlot('2021-03-20T13:00:00.000Z'), [
          createMockSlot('2021-03-20T11:00:00.000Z'),
          createMockSlot('2021-03-20T12:00:00.000Z'),
        ]),
      ).toEqual([
        createMockSlot('2021-03-20T11:00:00.000Z'),
        createMockSlot('2021-03-20T12:00:00.000Z'),
        createMockSlot('2021-03-20T13:00:00.000Z'),
      ]);
    });
  });

  describe('book', () => {
    it('should be book', (done) => {
      const sub = service.book$.subscribe();
      const testCase = ({ test: true } as unknown) as SmevBookResponseInterface;
      jest.spyOn(apiService, 'book').mockReturnValue(of(testCase));
      service.book(createMockSlot('2012-12-12')).subscribe((result) => {
        expect(result).toEqual(testCase);
        sub.unsubscribe();
        done();
      });
    });

    describe('bookRequest', () => {
      it('should be check generate bookId by isBookedDepartment = false', () => {
        const slot = createMockSlot('2012-12-12');
        jest.spyOn(service.bookId$$, 'next');
        service.getBookRequest(
          slot,
          '12',
          false,
          false,
          (mockTimeSlotValue as unknown) as TimeSlotValueInterface,
          configService.timeSlots[mockTimeSlotValue.timeSlotType],
          mockTimeSlotValue.department,
          'attr2',
          [],
          [],
          {},
        );
        expect(service.bookId$$.next).toHaveBeenCalled();
      });
      it('should be check generate bookId by bookId = null', () => {
        const slot = createMockSlot('2012-12-12');
        jest.spyOn(service.bookId$$, 'next');
        service.getBookRequest(
          slot,
          null,
          true,
          false,
          (mockTimeSlotValue as unknown) as TimeSlotValueInterface,
          configService.timeSlots[mockTimeSlotValue.timeSlotType],
          mockTimeSlotValue.department,
          'attr2',
          [],
          [],
          {},
        );
        expect(service.bookId$$.next).toHaveBeenCalled();
      });
      it('should be check generate bookId by waitingTimeExpired = true', () => {
        const slot = createMockSlot('2012-12-12');
        jest.spyOn(service.bookId$$, 'next');
        service.getBookRequest(
          slot,
          '12',
          true,
          true,
          (mockTimeSlotValue as unknown) as TimeSlotValueInterface,
          configService.timeSlots[mockTimeSlotValue.timeSlotType],
          mockTimeSlotValue.department,
          'attr2',
          [],
          [],
          {},
        );
        expect(service.bookId$$.next).toHaveBeenCalled();
      });
      it('should be check', () => {
        const slot = createMockSlot('2012-12-12');
        const result = service.getBookRequest(
          slot,
          '12',
          true,
          false,
          (mockTimeSlotValue as unknown) as TimeSlotValueInterface,
          configService.timeSlots[mockTimeSlotValue.timeSlotType],
          mockTimeSlotValue.department,
          'attr2',
          [],
          [],
          {},
        );

        expect(result).toEqual({
          preliminaryReservation: 'true',
          address: 'Российская Федерация, г. Москва, пр-кт. Ленинский, д. 44',
          orgName: 'Гагаринский отдел ЗАГС Управления ЗАГС Москвы',
          routeNumber: '45382000',
          subject: 'Регистрация заключения брака',
          userSelectedRegion: undefined,
          params: [
            { name: 'phone', value: '8(499)137-32-42' },
            { name: 'userSelectedRegionFromForm', value: undefined },
          ],
          eserviceId: '10000057526',
          serviceCode: '-100000100821',
          bookId: '12',
          organizationId: 'test',
          calendarName: 'на услугу «Регистрация заключения брака»',
          areaId: ['Дом музыки'],
          selectedHallTitle: 'e3758564-bf72-4bc3-be55-b6c4e3195427',
          parentOrderId: 1485144134,
          preliminaryReservationPeriod: '1440',
          attributes: [],
          slotId: ['e3758564-bf72-4bc3-be55-b6c4e3195427'],
          serviceId: ['ЗагсБрак'],
        });
      });
      it('should be check partial request', () => {
        const slot = createMockSlot('2012-12-12');
        const result = service.getBookRequest(
          slot,
          '12',
          true,
          false,
          (mockTimeSlotValue as unknown) as TimeSlotValueInterface,
          configService.timeSlots[mockTimeSlotValue.timeSlotType],
          mockTimeSlotValue.department,
          'attr2',
          [],
          null,
          { attributes: [{ name: 'sdf', value: 'sdf' }], subject: 'Р123' },
        );

        expect(result).toEqual({
          preliminaryReservation: 'true',
          address: 'Российская Федерация, г. Москва, пр-кт. Ленинский, д. 44',
          orgName: 'Гагаринский отдел ЗАГС Управления ЗАГС Москвы',
          routeNumber: '45382000',
          subject: 'Р123',
          userSelectedRegion: undefined,
          params: [
            { name: 'phone', value: '8(499)137-32-42' },
            { name: 'userSelectedRegionFromForm', value: undefined },
          ],
          eserviceId: '10000057526',
          serviceCode: '-100000100821',
          bookId: '12',
          organizationId: 'test',
          calendarName: 'на услугу «Регистрация заключения брака»',
          areaId: ['Дом музыки'],
          selectedHallTitle: 'e3758564-bf72-4bc3-be55-b6c4e3195427',
          parentOrderId: 1485144134,
          preliminaryReservationPeriod: '1440',
          attributes: [{ name: 'sdf', value: 'sdf' }],
          slotId: ['e3758564-bf72-4bc3-be55-b6c4e3195427'],
          serviceId: ['ЗагсБрак'],
        });
      });
    });
  });

  describe('store', () => {
    describe('request', () => {
      it('should be check', () => {
        const result = service.createRequest(
          (mockTimeSlotValue as unknown) as TimeSlotValueInterface,
          configService.timeSlots[mockTimeSlotValue.timeSlotType],
          [],
          [],
          {},
        );

        expect(result).toEqual({
          organizationId: ['test'],
          caseNumber: 1485144134,
          serviceId: ['ЗагсБрак'],
          eserviceId: '10000057526',
          routeNumber: '45382000',
          attributes: [],
        });
      });
      it('should be check partial request', () => {
        const result = service.createRequest(
          (mockTimeSlotValue as unknown) as TimeSlotValueInterface,
          configService.timeSlots[mockTimeSlotValue.timeSlotType],
          [],
          [{ name: 'attr', value: '123' }],
          { routeNumber: 'test', attributes: [{ name: 'test', value: 'test' }] },
        );

        expect(result).toEqual({
          organizationId: ['test'],
          caseNumber: 1485144134,
          serviceId: ['ЗагсБрак'],
          eserviceId: '10000057526',
          routeNumber: 'test',
          attributes: [{ name: 'test', value: 'test' }],
        });
      });
    });
  });
});
