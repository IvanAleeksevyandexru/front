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
} from '@epgu/epgu-constructor-ui-kit';

import { cloneDeep } from 'lodash';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { MockProvider } from 'ng-mocks';
import { Smev3TimeSlotsRestService } from './smev3-time-slots-rest.service';
import { DictionaryApiService } from '../../../../shared/services/dictionary/dictionary-api.service';
import { DictionaryApiServiceStub } from '../../../../shared/services/dictionary/dictionary-api.service.stub';

import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { TimeSlotsConstants, TimeSlotsTypes } from './time-slots.constants';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { ScreenStore } from '../../../../screen/screen.types';
import { Smev3TimeSlotsRestServiceStub } from './stubs/smev3-time-slots-rest.service.stub';

import { TimeSlotsService } from './time-slots.service';
import { mockScreenMvdStore } from './mocks/mock-screen-mvd-store';

import { mockScreenDivorceWithCacheStore } from './mocks/mock-screen-divorce-with-cache-store';
import { Smev2TimeSlotsRestService } from './smev2-time-slots-rest.service';
import { Smev2TimeSlotsRestServiceStub } from './stubs/smev2-time-slots-rest.service.stub';
import { DictionaryToolsService } from '../../../../shared/services/dictionary/dictionary-tools.service';

describe('TimeSlotsService', () => {
  let screenService: ScreenServiceStub;
  let timeSlotsService: TimeSlotsService;
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
        TimeSlotsConstants,
        EventBusService,
        DatesToolsService,
        TimeSlotsService,
        DownloadService,
        ObjectHelperService,
        JsonHelperService,
        SessionService,
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: Smev3TimeSlotsRestService, useClass: Smev3TimeSlotsRestServiceStub },
        { provide: Smev2TimeSlotsRestService, useClass: Smev2TimeSlotsRestServiceStub },
        { provide: LoggerService, useClass: LoggerServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    screenService = (TestBed.inject(ScreenService) as unknown) as ScreenServiceStub;
    timeSlotsService = TestBed.inject(TimeSlotsService);
    dictionaryApiService = TestBed.inject(DictionaryApiService);
    smev3TimeSlotsRestService = TestBed.inject(Smev3TimeSlotsRestService);
    timeSlotsService.cancelReservation = ['ts1', 'ts2', 'ts3'];
  });

  describe('MVD', () => {
    beforeEach(() => {
      const store: ScreenStore = cloneDeep(mockScreenMvdStore);
      screenService.initScreenStore((store as unknown) as ScreenStore);
      const { component } = screenService;
      compValue = JSON.parse(component.value);
      cachedAnswer = screenService.getCompValueFromCachedAnswers();
      if (cachedAnswer) {
        cachedAnswer = JSON.parse(cachedAnswer);
      }
      timeSlotsService.changed(compValue, cachedAnswer);
    });

    it("MVD should take organizationId from calculated organizationId component's value ", () => {
      const organizationId = timeSlotsService.getSlotsRequestOrganizationId(TimeSlotsTypes.MVD);
      expect(organizationId).toBe('123');
    });

    it('MVD should take organizationId from department.value', () => {
      const newCompValue = cloneDeep(compValue);
      delete newCompValue.organizationId;
      timeSlotsService.changed(newCompValue, cachedAnswer);
      const organizationId = timeSlotsService.getSlotsRequestOrganizationId(TimeSlotsTypes.MVD);
      expect(organizationId).toBe('9277');
    });
  });

  describe('RAZBRAK', () => {
    beforeEach(() => {
      const store: ScreenStore = cloneDeep(mockScreenDivorceWithCacheStore);
      screenService.initScreenStore((store as unknown) as ScreenStore);
      const { component } = screenService;
      timeSlotsService.timeSlotsType = TimeSlotsTypes.RAZBRAK;
      compValue = JSON.parse(component.value);
      cachedAnswer = screenService.getCompValueFromApplicantAnswers();
      if (cachedAnswer) {
        cachedAnswer = JSON.parse(cachedAnswer);
      }
      timeSlotsService.waitingTimeExpired = true;
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
      it('if waitingTimeExpired = true', (done) => {
        const cancelSpy = jest.spyOn<any, any>(timeSlotsService, 'cancelSlot');
        timeSlotsService.checkBooking(selectedSlot).subscribe(() => {
          expect(cancelSpy).toHaveBeenCalled();
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

      it('check cancel', (done) => {
        const cancelSpy = jest.spyOn<any, any>(timeSlotsService, 'cancelSlot');
        timeSlotsService.checkBooking(selectedSlot).subscribe(() => {
          expect(cancelSpy).toHaveBeenCalled();
          expect(timeSlotsService.getErrorMessage()).toEqual('some error');
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

      it('check cancel', (done) => {
        const cancelSpy = jest.spyOn<any, any>(timeSlotsService, 'cancelSlot');
        timeSlotsService.checkBooking(selectedSlot).subscribe(() => {
          expect(cancelSpy).toHaveBeenCalled();
          expect(timeSlotsService.getErrorMessage()).toBeNull();
          done();
        });
      });
    });

    it('getAvailableAreaNames should call request for areas', () => {
      const areaNamesSpy = jest.spyOn<any, any>(dictionaryApiService, 'getSelectMapDictionary');
      timeSlotsService.getAvailableAreaNames(null);
      expect(areaNamesSpy).toHaveBeenCalledTimes(1);
    });
  });
});
