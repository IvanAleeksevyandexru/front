import { TestBed } from '@angular/core/testing';
import { TimeSlotSmev3StateService } from './time-slot-smev3-state.service';
import { ConfigService, ConfigServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';
import { JsonHelperService } from '../../../../../../core/services/json-helper/json-helper.service';
import { TimeSlotsTypes } from '../../time-slot.const';
import { of } from 'rxjs';
import { TimeSlotsAnswerInterface, TimeSlotValueInterface } from '../../typings';
import { ComponentDto } from '@epgu/epgu-constructor-types';

const mockBookAttributes = [{ name: 'test', value: 1 }];

const mockTimeSlotValue = ({
  bookAttributes: JSON.stringify(mockBookAttributes),
  timeSlotRequestAttrs: [{ name: 'attrName', value: 'attrValue' }],
  timeSlotType: TimeSlotsTypes.BRAK,
  department: { value: '1' },
  solemn: 'Да',
  slotsPeriod: {
    value: '2021-10-01',
  },
  waitingTimeExpired: false,
} as unknown) as TimeSlotValueInterface;

const mockComponent = ({
  id: 'idComponent',
  type: 'TimeSlot',
  attrs: {
    attributeNameWithAddress: 'attr2',
    cancelReservation: ['res'],
    ignoreRootParams: ['attr'],
    bookingErrorHandling: [{ errorCode: '1' }],
    slotsNotFoundTemplate: {
      header: 't',
    },
  },
} as unknown) as ComponentDto;

export const mockAnswer = ({
  department: mockTimeSlotValue.department,
} as unknown) as TimeSlotsAnswerInterface;

describe('TimeSlotSmev3StateService', () => {
  let service: TimeSlotSmev3StateService;
  let screenService: ScreenService;
  let configService: ConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TimeSlotSmev3StateService,
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        JsonHelperService,
      ],
    });
    screenService = TestBed.inject(ScreenService);
    configService = TestBed.inject(ConfigService);
    jest.spyOn(screenService, 'componentValue$', 'get').mockReturnValue(of(mockTimeSlotValue));
    jest.spyOn(screenService, 'component$', 'get').mockReturnValue(of(mockComponent));
    jest
      .spyOn(screenService, 'getCompValueFromCachedAnswers')
      .mockReturnValue(JSON.stringify(mockAnswer));

    service = TestBed.inject(TimeSlotSmev3StateService);
  });

  describe('base', () => {
    it('should be check value$', (done) => {
      service.value$.subscribe((value) => {
        expect(value).toBe(mockTimeSlotValue);
        done();
      });
    });
    it('should be check timeSlotRequestAttrs$', (done) => {
      service.timeSlotRequestAttrs$.subscribe((value) => {
        expect(value).toBe(mockTimeSlotValue.timeSlotRequestAttrs);
        done();
      });
    });
    it('should be check bookingErrorHandling$', (done) => {
      service.bookingErrorHandling$.subscribe((value) => {
        expect(value).toBe(mockComponent.attrs.bookingErrorHandling);
        done();
      });
    });
    it('should be check slotsNotFoundTemplate$', (done) => {
      service.slotsNotFoundTemplate$.subscribe((value) => {
        expect(value).toBe(mockComponent.attrs.slotsNotFoundTemplate);
        done();
      });
    });
    it('should be check ignoreRootParams$', (done) => {
      service.ignoreRootParams$.subscribe((value) => {
        expect(value).toBe(mockComponent.attrs.ignoreRootParams);
        done();
      });
    });
    it('should be check department$', (done) => {
      service.department$.subscribe((value) => {
        expect(value).toBe(mockTimeSlotValue.department);
        done();
      });
    });
    it('should be check type$', (done) => {
      service.type$.subscribe((value) => {
        expect(value).toBe(mockTimeSlotValue.timeSlotType);
        done();
      });
    });
    it('should be check config$', (done) => {
      service.config$.subscribe((value) => {
        expect(value).toBe(configService.timeSlots[mockTimeSlotValue.timeSlotType]);
        done();
      });
    });
    it('should be check cachedAnswer$', (done) => {
      service.cachedAnswer$.subscribe((value) => {
        expect(value).toEqual(mockAnswer);
        done();
      });
    });
    it('should be check waitingTimeExpired$', (done) => {
      service.waitingTimeExpired$.subscribe((value) => {
        expect(value).toBe(mockTimeSlotValue.waitingTimeExpired);
        done();
      });
    });
    it('should be check slotsPeriod$', (done) => {
      service.slotsPeriod$.subscribe((value) => {
        expect(value).toBe('2021-10');
        done();
      });
    });
    it('should be check solemn$', (done) => {
      service.solemn$.subscribe((value) => {
        expect(value).toBe(true);
        done();
      });
    });
    it('should be check cancelReservation$', (done) => {
      service.cancelReservation$.subscribe((value) => {
        expect(value).toEqual([mockComponent.id, ...mockComponent.attrs.cancelReservation]);
        done();
      });
    });
    it('should be check cancelList$', (done) => {
      service.cancelList$.subscribe((value) => {
        expect(value).toEqual([mockAnswer, mockAnswer]);
        done();
      });
    });
    it('should be check attributeNameWithAddress$', (done) => {
      service.attributeNameWithAddress$.subscribe((value) => {
        expect(value).toBe(mockComponent.attrs.attributeNameWithAddress);
        done();
      });
    });
    it('should be check bookAttributes$', (done) => {
      service.bookAttributes$.subscribe((value) => {
        expect(value).toEqual(mockBookAttributes);
        done();
      });
    });
  });
});
