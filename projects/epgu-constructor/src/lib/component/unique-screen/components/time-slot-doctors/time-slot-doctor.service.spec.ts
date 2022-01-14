import { TestBed } from '@angular/core/testing';
import {
  ConfigService,
  ObjectHelperService,
  SessionService,
  JsonHelperService,
  ConfigServiceStub,
  ModalService,
  ModalServiceStub,
  LoggerService,
  LoggerServiceStub,
  EventBusService,
  DatesToolsService,
  DownloadService,
  SlotInterface,
} from '@epgu/epgu-constructor-ui-kit';

import { cloneDeep } from 'lodash';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { MockProvider } from 'ng-mocks';
import { DictionaryApiService } from '../../../../shared/services/dictionary/dictionary-api.service';
import { DictionaryApiServiceStub } from '../../../../shared/services/dictionary/dictionary-api.service.stub';

import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { ScreenStore } from '../../../../screen/screen.types';
import { DictionaryToolsService } from '../../../../shared/services/dictionary/dictionary-tools.service';
import { TimeSlotDoctorService } from './time-slot-doctor.service';
import { Smev3TimeSlotsRestServiceStub } from '../time-slots/stubs/smev3-time-slots-rest.service.stub';
import { TimeSlotsConstants } from '../time-slots/time-slots.constants';
import { Smev3TimeSlotsRestService } from '../time-slots/smev3-time-slots-rest.service';
import { TimeSlotsTypes } from '../time-slot/time-slot.const';
import { mockScreenDoctorStore } from '../time-slots/mocks/mock-screen-doctor-store';
import { mockSlots } from '../time-slots/mocks/mock-time-slots';
import { SmevSlotsResponseInterface, TimeSlot } from '../time-slots/time-slots.types';

describe('TimeSlotDoctorService', () => {
  let screenService: ScreenServiceStub;
  let timeSlotsService: TimeSlotDoctorService;
  let dictionaryApiService: DictionaryApiService;
  let compValue;
  let cachedAnswer;
  let smev3TimeSlotsRestService: Smev3TimeSlotsRestService;
  const selectedSlot = {
    slotId: '1623920400:15:6nTeINTk4LocPmNyk9OM',
    areaId: null,
    slotTime: new Date('2021-06-20T08:00:00.000Z'),
    timezone: '+03:00',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        MockProvider(DictionaryToolsService),
        CurrentAnswersService,
        TimeSlotDoctorService,
        TimeSlotsConstants,
        EventBusService,
        DatesToolsService,
        DownloadService,
        ObjectHelperService,
        JsonHelperService,
        SessionService,
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: Smev3TimeSlotsRestService, useClass: Smev3TimeSlotsRestServiceStub },
        { provide: LoggerService, useClass: LoggerServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    screenService = (TestBed.inject(ScreenService) as unknown) as ScreenServiceStub;
    timeSlotsService = TestBed.inject(TimeSlotDoctorService);
    dictionaryApiService = TestBed.inject(DictionaryApiService);
    smev3TimeSlotsRestService = TestBed.inject(Smev3TimeSlotsRestService);
    timeSlotsService.cancelReservation = ['ts1', 'ts2', 'ts3'];
  });

  describe('checkBooking()', () => {
    beforeEach(() => {
      const store: ScreenStore = cloneDeep(mockScreenDoctorStore) as ScreenStore;
      screenService.initScreenStore(store);
      const { component } = screenService;
      timeSlotsService.timeSlotsType = TimeSlotsTypes.DOCTOR;
      compValue = JSON.parse(component.value);
      cachedAnswer = screenService.getCompValueFromCachedAnswers();
      if (cachedAnswer) {
        cachedAnswer = JSON.parse(cachedAnswer);
      }
      timeSlotsService.waitingTimeExpired = true;
      timeSlotsService.state$$.next({ docLookup: {}, specLookup: {}, bookingRequestAttrs: {} });
      timeSlotsService.changed(compValue, cachedAnswer);
    });
    describe('no error for object in cancel response', () => {
      beforeEach(() => {
        jest.spyOn(smev3TimeSlotsRestService, 'cancelSlot').mockReturnValueOnce(
          of({
            bookId: null,
            esiaId: null,
            status: null,
            error: {
              errorDetail: { errorCode: 0, errorMessage: 'Operation completed' },
              fieldErrors: [],
            },
          }),
        );
      });
      it('if waitingTimeExpired = true', () => {
        const cancelSpy = jest.spyOn<any, any>(timeSlotsService, 'cancelSlot');
        timeSlotsService.checkBooking(selectedSlot).subscribe(() => {
          expect(cancelSpy).toHaveBeenCalled();
          expect(timeSlotsService.getErrorMessage()).toBeNull();
        });
      });

      it('if waitingTimeExpired = false', (done) => {
        timeSlotsService.waitingTimeExpired = false;
        const cancelSpy = jest.spyOn<any, any>(timeSlotsService, 'cancelSlot');
        timeSlotsService.checkBooking(selectedSlot).subscribe(() => {
          expect(cancelSpy).toHaveBeenCalledTimes(0);
          expect(timeSlotsService.getErrorMessage()).toBeNull();
          done();
        });
      });
    });

    describe('error for object in cancel response', () => {
      beforeEach(() => {
        jest.spyOn(smev3TimeSlotsRestService, 'cancelSlot').mockReturnValueOnce(
          of({
            bookId: null,
            esiaId: null,
            status: null,
            error: {
              errorDetail: { errorCode: 123, errorMessage: 'some error' },
              fieldErrors: [],
            },
          }),
        );
      });

      it('if waitingTimeExpired = true', () => {
        const cancelSpy = jest.spyOn<any, any>(timeSlotsService, 'cancelSlot');
        timeSlotsService.checkBooking(selectedSlot).subscribe(() => {
          expect(cancelSpy).toHaveBeenCalled();
          expect(timeSlotsService.getErrorMessage()).toEqual('some error');
        });
      });

      it('if waitingTimeExpired = false', (done) => {
        timeSlotsService.waitingTimeExpired = false;
        const cancelSpy = jest.spyOn<any, any>(timeSlotsService, 'cancelSlot');
        timeSlotsService.checkBooking(selectedSlot).subscribe(() => {
          expect(cancelSpy).toHaveBeenCalledTimes(0);
          expect(timeSlotsService.getErrorMessage()).toBeNull();
          done();
        });
      });
    });

    describe('no error for null in cancel response', () => {
      beforeEach(() => {
        jest.spyOn(smev3TimeSlotsRestService, 'cancelSlot').mockReturnValueOnce(
          of({
            bookId: null,
            esiaId: null,
            status: null,
            error: null,
          }),
        );
      });

      it('if waitingTimeExpired = true', () => {
        const cancelSpy = jest.spyOn<any, any>(timeSlotsService, 'cancelSlot');
        timeSlotsService.checkBooking(selectedSlot).subscribe(() => {
          expect(cancelSpy).toHaveBeenCalled();
          expect(timeSlotsService.getErrorMessage()).toBeNull();
        });
      });

      it('if waitingTimeExpired = false', (done) => {
        timeSlotsService.waitingTimeExpired = false;
        const cancelSpy = jest.spyOn<any, any>(timeSlotsService, 'cancelSlot');
        timeSlotsService.checkBooking(selectedSlot).subscribe(() => {
          expect(cancelSpy).toHaveBeenCalledTimes(0);
          expect(timeSlotsService.getErrorMessage()).toBeNull();
          done();
        });
      });
    });
  });

  describe('getAvailableSlots()', () => {
    it('should get slots from slots map', () => {
      const testSlots = [];
      timeSlotsService.slotsMap = { 2000: { 1: { 1: testSlots } } };

      timeSlotsService.getAvailableSlots(new Date(2000, 1, 1)).subscribe((slots) => {
        expect(slots).toBe(testSlots);
      });
    });

    it('should get slots from slots map with areaId', () => {
      const testSlots = ([{ areaId: 2 }, { areaId: 3 }] as unknown) as SlotInterface[];
      timeSlotsService.slotsMap = { 2000: { 1: { 1: testSlots } } };

      timeSlotsService.getAvailableSlots(new Date(2000, 1, 1), 2).subscribe((slots) => {
        expect(slots[0].areaId).toBe(2);
        expect(slots.length).toBe(1);
      });
    });
  });

  describe('_deleteIgnoreRequestParams()', () => {
    it('should return request params as is', () => {
      const store: ScreenStore = cloneDeep(mockScreenDoctorStore) as ScreenStore;
      store.display.components[0].attrs.ignoreRootParams = null;
      screenService.initScreenStore(store);
      const requestParams = { caseNumber: 'b' };

      const processedParams = timeSlotsService.deleteIgnoreRequestParams(requestParams);

      expect(processedParams.caseNumber).toBe('b');
    });

    it('should delete listed fields from request params', () => {
      const store: ScreenStore = cloneDeep(mockScreenDoctorStore) as ScreenStore;
      store.display.components[0].attrs.ignoreRootParams = ['caseNumber'];
      screenService.initScreenStore(store);
      const requestParams = { caseNumber: 'b' };

      const processedParams = timeSlotsService.deleteIgnoreRequestParams(requestParams);

      expect(processedParams.caseNumber).toBe(undefined);
    });
  });

  describe('changed()', () => {
    let testCompValue;
    let testCachedAnswer;

    beforeEach(() => {
      const store: ScreenStore = cloneDeep(mockScreenDoctorStore) as ScreenStore;
      screenService.initScreenStore(store);
      const { component } = screenService;
      timeSlotsService.timeSlotsType = TimeSlotsTypes.DOCTOR;
      compValue = JSON.parse(component.value);
      cachedAnswer = screenService.getCompValueFromCachedAnswers();
      if (cachedAnswer) {
        cachedAnswer = JSON.parse(cachedAnswer);
      }
      timeSlotsService.waitingTimeExpired = true;
      timeSlotsService.state$$.next({ docLookup: {}, specLookup: {}, bookingRequestAttrs: {} });
      testCompValue = compValue;
      testCachedAnswer = cachedAnswer;
    });

    it('should compare passed department to cachedAnswer', () => {
      testCompValue.department = JSON.stringify({ value: 1, attributeValues: { AREA_NAME: 3 } });
      testCachedAnswer = {};
      testCachedAnswer.department = { value: 1, attributeValues: { AREA_NAME: 3 } };

      timeSlotsService.changed(testCompValue, testCachedAnswer);

      expect(timeSlotsService.isBookedDepartment).toBeTruthy();
    });

    it('should set new department if departments are not the same', () => {
      const testDepartment = { value: 1, attributeValues: { AREA_NAME: 4 } };
      testCompValue.department = JSON.stringify(testDepartment);
      testCachedAnswer = {};
      testCachedAnswer.department = { value: 1, attributeValues: { AREA_NAME: 3 } };

      timeSlotsService.changed(testCompValue, testCachedAnswer);

      expect(timeSlotsService.department).toEqual(testDepartment);
    });
  });

  describe('init()', () => {
    let testCompValue;
    let testCachedAnswer;
    beforeEach(() => {
      const store: ScreenStore = cloneDeep(mockScreenDoctorStore) as ScreenStore;
      screenService.initScreenStore(store);
      const { component } = screenService;
      timeSlotsService.timeSlotsType = TimeSlotsTypes.DOCTOR;
      compValue = JSON.parse(component.value);
      cachedAnswer = screenService.getCompValueFromCachedAnswers();
      if (cachedAnswer) {
        cachedAnswer = JSON.parse(cachedAnswer);
      }
      timeSlotsService.waitingTimeExpired = true;
      timeSlotsService.state$$.next({ docLookup: {}, specLookup: {}, bookingRequestAttrs: {} });
      testCompValue = compValue;
      testCachedAnswer = cachedAnswer;
    });

    it('should create slotsMap if no error has been received', () => {
      jest
        .spyOn(smev3TimeSlotsRestService, 'getTimeSlots')
        .mockReturnValue(of(mockSlots as SmevSlotsResponseInterface));

      timeSlotsService.init(testCompValue, testCachedAnswer).subscribe();

      expect(Object.keys(timeSlotsService.slotsMap).length).toBeTruthy();
    });

    it('should create slotsMap if error has been received from request', () => {
      const mockSlotsCopy = JSON.parse(JSON.stringify(mockSlots));
      mockSlotsCopy.error = { errorDetail: { errorCode: 2, errorDetail: 'detail' } };
      jest
        .spyOn(smev3TimeSlotsRestService, 'getTimeSlots')
        .mockReturnValue(of(mockSlotsCopy as SmevSlotsResponseInterface));

      timeSlotsService.init(testCompValue, testCachedAnswer).subscribe();

      expect(Object.keys(timeSlotsService.slotsMap).length).toBeFalsy();
      expect(timeSlotsService.hasError()).toBeTruthy();
    });
  });

  describe('initSlotsMap()', () => {
    it('should create slots map', () => {
      const slots = [
        {
          slotId: 'e3758564-bf72-4bc3-be55-b6c4e3195427',
          serviceId: '10000000000456',
          organizationId: 'R7700005',
          areaId: 'Дом музыки',
          visitTime: 1584691200000,
          visitTimeStr: '2020-03-20T08:00:00.000',
          visitTimeISO: '2020-03-20T08:00:00Z',
          queueNumber: null,
          duration: null,
          attributes: [],
        },
        {
          slotId: '491f340e-39ac-484d-b10e-e6439e4feb03',
          serviceId: null,
          organizationId: '1.2.643.5.1.13.13.12.2.78.8632.0.190157',
          areaId: '0',
          visitTime: 1621938240000,
          visitTimeStr: '2021-05-25T13:24:00.000',
          visitTimeISO: '2021-05-25T13:24:00+03:00',
          queueNumber: null,
          duration: null,
          attributes: [],
        },
      ] as TimeSlot[];
      timeSlotsService.slotsMap = {};
      timeSlotsService.availableMonths = [];

      timeSlotsService.initSlotsMap(slots);

      expect(timeSlotsService.slotsMap[2020][2][20][0].slotTime).toEqual(
        new Date(slots[0].visitTimeStr),
      );
      expect(timeSlotsService.slotsMap[2021][4][25][0].slotTime).toEqual(
        new Date(slots[1].visitTimeStr),
      );
    });
  });
});
