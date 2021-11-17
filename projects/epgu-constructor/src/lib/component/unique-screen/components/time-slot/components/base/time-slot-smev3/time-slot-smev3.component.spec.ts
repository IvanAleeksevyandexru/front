import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimeSlotSmev3Component } from './time-slot-smev3.component';
import { MockComponent } from 'ng-mocks';
import { TimeSlotMonthComponent } from '../../calendar/time-slot-month/time-slot-month.component';
import { TimeSlotCalendarComponent } from '../../calendar/time-slot-calendar/time-slot-calendar.component';
import { TimeSlotTimeComponent } from '../../calendar/time-slot-time/time-slot-time.component';
import { TimeSlotStateService } from '../../../services/state/time-slot-state.service';
import {
  ConfigService,
  ConfigServiceStub,
  DatesToolsService,
  DatesToolsServiceStub,
  EventBusService,
  HttpCancelService,
  ModalService,
  ModalServiceStub,
  ScreenPadModule,
  UnsubscribeService,
} from '@epgu/epgu-constructor-ui-kit';

import { ScreenService } from '../../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../../screen/screen.service.stub';
import { ActionService } from '../../../../../../../shared/directives/action/action.service';
import { ActionServiceStub } from '../../../../../../../shared/directives/action/action.service.stub';
import { TimeSlotErrorService } from '../../../services/error/time-slot-error.service';

import { TimeSlotCalendarService } from '../../../services/calendar/time-slot-calendar.service';

import { TimeSlotSmev3Service } from '../../../services/smev3/time-slot-smev3.service';
import { TimeSlotSmev3ServiceStub } from '../../../services/smev3/time-slot-smev3.service.stub';

import { TimeSlotSmev3StateService } from '../../../services/smev3-state/time-slot-smev3-state.service';
import { TimeSlotsConstants } from '../../../../time-slots/time-slots.constants';
import { FormPlayerService } from '../../../../../../../form-player/services/form-player/form-player.service';
import { FormPlayerServiceStub } from '../../../../../../../form-player/services/form-player/form-player.service.stub';
import { of } from 'rxjs';
import { BaseModule } from '../../../../../../../shared/base.module';
import {
  ITEMS_FAILURE,
  SERVICE_OR_SPEC_SESSION_TIMEOUT,
} from '../../../../../../../core/services/error-handler/error-handler';
import {
  Slot,
  SlotListFilterProvider,
  TimeSlotError,
  TimeSlotsAnswerInterface,
} from '../../../typings';
import { IBookingErrorHandling, SlotsNotFoundTemplate } from '@epgu/epgu-constructor-types';
import { baseHandlers } from '../../../handlers/base-handlers';
import { getConfirmChangeTimeModalParams, templateList } from './data';
import { CurrentAnswersService } from '../../../../../../../screen/current-answers.service';
import { CurrentAnswersServiceStub } from '../../../../../../../screen/current-answers-service.stub';
import { JsonHelperService } from '../../../../../../../core/services/json-helper/json-helper.service';

const createMockSlot = (id: string, date: string) =>
  ({
    slotId: id,
    timezone: '+3',
    slotTime: new Date(date),
  } as Slot);

describe('TimeSlotSmev3Component', () => {
  let component: TimeSlotSmev3Component;
  let fixture: ComponentFixture<TimeSlotSmev3Component>;
  let screenService: ScreenService;
  let smev3Service: TimeSlotSmev3Service;
  let calendarService: TimeSlotCalendarService;
  let state: TimeSlotStateService;
  let error: TimeSlotErrorService;
  let smev3: TimeSlotSmev3StateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TimeSlotSmev3Component,
        MockComponent(TimeSlotMonthComponent),
        MockComponent(TimeSlotCalendarComponent),
        MockComponent(TimeSlotTimeComponent),
      ],
      imports: [BaseModule, ScreenPadModule],
      providers: [
        { provide: TimeSlotSmev3Service, useClass: TimeSlotSmev3ServiceStub },
        HttpCancelService,
        { provide: DatesToolsService, useClass: DatesToolsServiceStub },
        UnsubscribeService,
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ActionService, useClass: ActionServiceStub },
        EventBusService,
        { provide: CurrentAnswersService, useClass: CurrentAnswersServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        TimeSlotsConstants,
        { provide: FormPlayerService, useClass: FormPlayerServiceStub },
        TimeSlotStateService,
        TimeSlotErrorService,
        TimeSlotCalendarService,
        TimeSlotSmev3StateService,
        JsonHelperService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    calendarService = TestBed.inject(TimeSlotCalendarService);
    calendarService.refDate$ = of(new Date());
    smev3Service = TestBed.inject(TimeSlotSmev3Service);
    state = TestBed.inject(TimeSlotStateService);
    smev3 = TestBed.inject(TimeSlotSmev3StateService);
    error = TestBed.inject(TimeSlotErrorService);
    smev3Service.cancel$ = of(null);
    smev3Service.book$ = of(null);
    smev3Service.store$ = of([]);
    smev3Service.bookedSlot$ = of(null);
    screenService = TestBed.inject(ScreenService);
    screenService.component = { id: '123', attrs: {}, type: 'TimeSlots' };
    fixture = TestBed.createComponent(TimeSlotSmev3Component);
    component = fixture.componentInstance;
  });

  describe('inheritance', () => {
    it('should be book', () => {
      jest.spyOn(component.next$$, 'next');
      component.book('123');
      expect(component.next$$.next).toHaveBeenCalledWith('123');
    });
    it('should be changeHaveUnlockedDaysAction', () => {
      component.changeHaveUnlockedDaysAction(true);
      expect(calendarService.haveUnlockedDays).toBe(true);
    });
    it('should be changeSlot', () => {
      jest.spyOn(component, 'setResult');
      component.changeSlot(createMockSlot('12', '2012-12-12'));
      expect(component.setResult).toHaveBeenCalled();
    });
  });

  describe('base', () => {
    it('should be isCachedValueChanged', () => {
      let slot = { slotId: '2' };
      let res = component.isCachedValueChanged(
        ({ timeSlot: slot } as unknown) as TimeSlotsAnswerInterface,
        ({ slotId: '2' } as unknown) as Slot,
      );
      expect(res).toBe(false);
      slot = { slotId: '1' };
      res = component.isCachedValueChanged(
        ({ timeSlot: slot } as unknown) as TimeSlotsAnswerInterface,
        ({ slotId: '2' } as unknown) as Slot,
      );
      expect(res).toBe(true);
    });
    it('should be getSlotList', () => {
      jest.spyOn(smev3Service, 'getSlotListByDate').mockReturnValueOnce([]);
      jest
        .spyOn(smev3Service, 'addBookedTimeSlotToList')
        .mockReturnValueOnce([({ slotId: '1' } as unknown) as Slot]);

      let res = component.getSlotList(
        new Date('12/12/12'),
        null,
        null,
        (() => true) as SlotListFilterProvider,
      );

      expect(res).toEqual([({ slotId: '1' } as unknown) as Slot]);

      res = component.getSlotList(null, null, null, (() => true) as SlotListFilterProvider);
      expect(res).toEqual([]);
    });
    it('should be isDateLocked', () => {
      jest.spyOn(component, 'getSlotList').mockReturnValueOnce([]);
      let res = component.isDateLocked(null, null, null, null);
      expect(res).toBe(true);

      jest.spyOn(component, 'getSlotList').mockReturnValueOnce([({} as unknown) as Slot]);
      res = component.isDateLocked(null, null, null, null);
      expect(res).toBe(false);
    });
    it('should be findJsonParamsForErrorHandling', () => {
      const testBookingHandling = [
        ({
          errorCode: '2',
        } as unknown) as IBookingErrorHandling,
      ];
      const testError = ({
        code: 2,
        message: 'test',
      } as unknown) as TimeSlotError;

      let res = component.findJsonParamsForErrorHandling(undefined, []);
      expect(res).toBe(null);

      res = component.findJsonParamsForErrorHandling(testError, testBookingHandling);
      expect(res).toEqual(testBookingHandling[0]);

      testBookingHandling[0].errorMessageRegExp = 'test';
      res = component.findJsonParamsForErrorHandling(testError, testBookingHandling);
      expect(res).toEqual(testBookingHandling[0]);

      testBookingHandling[0].errorMessageRegExp = 'test2';
      res = component.findJsonParamsForErrorHandling(testError, testBookingHandling);
      expect(res).toEqual(undefined);
    });
    it('should be next', () => {
      expect(1).toBe(1);
    });
  });

  describe('showCustomError', () => {
    beforeEach(() => {
      jest.spyOn(state, 'showModal').mockReturnValue(of(null));
    });

    it('should be no action', () => {
      component.showCustomError(null, null);
      expect(state.showModal).not.toHaveBeenCalled();
    });

    it('should be SMEV2_SERVICE_OR_SPEC_SESSION_TIMEOUT', () => {
      jest.spyOn(error, 'getErrorMessage').mockReturnValueOnce('Закончилось время');

      component.showCustomError(
        ({} as unknown) as TimeSlotError,
        ([] as unknown) as IBookingErrorHandling[],
      );

      expect(state.showModal).toHaveBeenCalledWith(SERVICE_OR_SPEC_SESSION_TIMEOUT);
    });

    it('should be errorHandlingParams', () => {
      const testModalParams = {
        title: '',
        text: '',
        showCloseButton: false,
        showCrossButton: false,
        buttons: [
          {
            label: 'На главную',
            closeModal: true,
            color: 'white',
            action: {
              type: 'redirectToLK',
            },
          },
        ],
      };

      jest.spyOn(error, 'getErrorMessage').mockReturnValue('Ошибочка вышла');

      component.showCustomError(
        ({
          code: 2,
        } as unknown) as TimeSlotError,
        [
          {
            errorCode: '2',
            modalAttributes: testModalParams as any,
          },
        ],
      );

      expect(state.showModal).toHaveBeenCalledWith(testModalParams);
    });

    it('should be !errorHandlingParams', () => {
      const params = {
        ...ITEMS_FAILURE,
        buttons: [
          {
            label: 'Начать заново',
            closeModal: true,
            value: 'init',
          },
          {
            label: 'Попробовать ещё раз',
            closeModal: true,
          },
        ],
      };
      params.text = params.text.replace(/\{textAsset\}?/g, 'Ошибочка вышла');

      jest.spyOn(error, 'getErrorMessage').mockReturnValue('Ошибочка вышла');
      jest.spyOn(smev3Service, 'clearMessage').mockReturnValueOnce('Ошибочка вышла');

      component.showCustomError(
        ({} as unknown) as TimeSlotError,
        ([] as unknown) as IBookingErrorHandling[],
      );

      expect(state.showModal).toHaveBeenCalledWith(params);
    });
  });

  describe('processing', () => {
    it('should be bookedSlot = false', () => {
      jest.spyOn(component, 'booking').mockImplementation(() => of(null));

      component.processing(null, null, null, null, null, null, null);

      expect(component.booking).toHaveBeenCalled();
    });
    it('should be bookedSlot = true', () => {
      jest.spyOn(state, 'showModal').mockReturnValue(of(null));

      component.processing(
        null,
        ({ slotId: 2 } as unknown) as Slot,
        ({ slotId: '2' } as unknown) as Slot,
        null,
        null,
        null,
        null,
      );

      expect(state.showModal).toHaveBeenCalledWith(getConfirmChangeTimeModalParams());
    });
    it('should be isCachedValueChanged = false', () => {
      jest.spyOn(state, 'setResult');
      jest.spyOn(component, 'finish');
      jest.spyOn(state, 'showModal').mockReturnValue(of(null));
      const slot = { slotId: '2' };
      component.processing(
        '2',
        (slot as unknown) as Slot,
        ({ slotId: 2 } as unknown) as Slot,
        null,
        ({ timeSlot: slot } as unknown) as TimeSlotsAnswerInterface,
        null,
        null,
      );

      expect(state.showModal).not.toHaveBeenCalledWith(getConfirmChangeTimeModalParams());
      expect(component.finish).toHaveBeenCalledWith('2');
      expect(state.setResult).toHaveBeenCalledWith(({
        timeSlot: slot,
      } as unknown) as TimeSlotsAnswerInterface);
    });
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      error.errorHandling$ = of(null);
      error.error$ = of(null);
      smev3.slotsNotFoundTemplate$ = of(null);
      smev3Service.bookedSlot$ = of(null);
      smev3Service.isBookedDepartment$ = of(null);
    });

    it('should be resetHandlers', () => {
      jest.spyOn(error, 'resetHandlers');
      component.ngOnInit();
      expect(error.resetHandlers).toHaveBeenCalled();
    });
    it('should be addHandlers', () => {
      jest.spyOn(error, 'addHandlers');
      component.ngOnInit();
      expect(error.addHandlers).toHaveBeenCalledWith(baseHandlers);
    });
    it('should setAllTemplates for slotsNotFoundTemplate$', () => {
      jest.spyOn(error, 'setAllTemplates');
      component.ngOnInit();

      expect(error.setAllTemplates).toHaveBeenCalledWith(templateList);
      const slotsNotFoundTemplate = ({ header: 'чек' } as unknown) as SlotsNotFoundTemplate;
      smev3.slotsNotFoundTemplate$ = of(slotsNotFoundTemplate);
      component.ngOnInit();
      expect(error.setAllTemplates).toHaveBeenCalledWith({
        SLOTS_NOT_FOUND: slotsNotFoundTemplate,
      });
    });
    it('should change bookedSlot', () => {
      const testDate = new Date('12/12/12');
      const testSlot = ({ slotId: '1', slotTime: testDate } as unknown) as Slot;
      smev3Service.bookedSlot$ = of(testSlot);
      smev3Service.isBookedDepartment$ = of(true);
      component.ngOnInit();
      expect(state.day).toBe(testDate);
      expect(state.slot).toBe(testSlot);
    });

    it('should not change bookedSlot', () => {
      jest.spyOn(component, 'changeDayAction');
      jest.spyOn(component, 'changeSlotAction');

      smev3Service.bookedSlot$ = of(({ slotId: '1' } as unknown) as Slot);
      smev3Service.isBookedDepartment$ = of(false);

      component.ngOnInit();
      expect(component.changeDayAction).not.toHaveBeenCalled();
      expect(component.changeSlotAction).not.toHaveBeenCalled();
      expect(state.day).toBe(null);
      expect(state.slot).toBe(null);
    });

    it('should reload store with error', () => {
      jest.spyOn(smev3Service, 'reloadStore');
      error.error$ = of({});
      component.ngOnInit();
      expect(smev3Service.reloadStore).toHaveBeenCalled();
    });
  });
});
