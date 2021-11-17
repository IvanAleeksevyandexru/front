import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSlotSmev2Component } from './time-slot-smev2.component';
import { TimeSlotStateService } from '../../../services/state/time-slot-state.service';
import { TimeSlotCalendarService } from '../../../services/calendar/time-slot-calendar.service';
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
import { TimeSlotSmev2Service } from '../../../services/smev2/time-slot-smev2.service';
import { ScreenService } from '../../../../../../../screen/screen.service';
import { ActionService } from '../../../../../../../shared/directives/action/action.service';
import { TimeSlotErrorService } from '../../../services/error/time-slot-error.service';
import { TimeSlotStateServiceStub } from '../../../services/state/time-slot-state.service.stub';
import { TimeSlotSmev2ServiceStub } from '../../../services/smev2/time-slot-smev2.service.stub';
import { ScreenServiceStub } from '../../../../../../../screen/screen.service.stub';
import { ActionServiceStub } from '../../../../../../../shared/directives/action/action.service.stub';
import { TimeSlotErrorServiceStub } from '../../../services/error/time-slot-error.service.stub';
import { TimeSlotMonthComponent } from '../../calendar/time-slot-month/time-slot-month.component';
import { TimeSlotCalendarComponent } from '../../calendar/time-slot-calendar/time-slot-calendar.component';
import { TimeSlotTimeComponent } from '../../calendar/time-slot-time/time-slot-time.component';
import { MockComponent } from 'ng-mocks';

import { of } from 'rxjs';
import { BaseModule } from '../../../../../../../shared/base.module';
import { Slot } from '../../../typings';
import { CurrentAnswersService } from '../../../../../../../screen/current-answers.service';
import { CurrentAnswersServiceStub } from '../../../../../../../screen/current-answers-service.stub';

import { HttpClientTestingModule } from '@angular/common/http/testing';

const createMockSlot = (id: string, date: string) =>
  ({
    slotId: id,
    timezone: '+3',
    slotTime: new Date(date),
  } as Slot);

const testCase = [createMockSlot('d', '2012-12-12')];

describe('TimeSlotSmev2Component', () => {
  let component: TimeSlotSmev2Component;
  let fixture: ComponentFixture<TimeSlotSmev2Component>;
  let screenService: ScreenService;
  let calendarService: TimeSlotCalendarService;
  let stateService: TimeSlotStateService;
  let errorService: TimeSlotErrorService;
  let dateService: DatesToolsService;
  let smev2Service: TimeSlotSmev2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TimeSlotSmev2Component,
        MockComponent(TimeSlotMonthComponent),
        MockComponent(TimeSlotCalendarComponent),
        MockComponent(TimeSlotTimeComponent),
      ],
      imports: [BaseModule, ScreenPadModule, HttpClientTestingModule],
      providers: [
        TimeSlotStateService,
        { provide: CurrentAnswersService, useClass: CurrentAnswersServiceStub },
        HttpCancelService,
        { provide: ConfigService, useClass: ConfigServiceStub },
        UnsubscribeService,
        { provide: TimeSlotSmev2Service, useClass: TimeSlotSmev2ServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ActionService, useClass: ActionServiceStub },
        EventBusService,
        { provide: TimeSlotErrorService, useClass: TimeSlotErrorServiceStub },
        TimeSlotCalendarService,
        DatesToolsService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    smev2Service = TestBed.inject(TimeSlotSmev2Service);
    calendarService = TestBed.inject(TimeSlotCalendarService);
    calendarService.today$ = of(new Date('2012-12-12'));
    errorService = TestBed.inject(TimeSlotErrorService);
    stateService = TestBed.inject(TimeSlotStateService);
    screenService = TestBed.inject(ScreenService);
    screenService.component = { id: '123', attrs: {}, type: 'TimeSlots' };
    dateService = TestBed.inject(DatesToolsService);

    jest.spyOn(stateService, 'day$', 'get').mockReturnValue(of(new Date('2012-12-12')));

    jest.spyOn(smev2Service, 'getList').mockReturnValue(of(testCase));
    jest.spyOn(stateService, 'setMonths');
    jest.spyOn(stateService, 'setList');
    fixture = TestBed.createComponent(TimeSlotSmev2Component);
    component = fixture.componentInstance;
    stateService.slot = createMockSlot('d1', '2012-12-12');
  });

  describe('inheritance', () => {
    it('should be changeSlot', () => {
      stateService.slot = createMockSlot('d1', '2012-12-12');
      jest.spyOn(component, 'changeSlot');
      component.changeSlotAction(createMockSlot('d2', '2012-12-13'));
      expect(component.changeSlot).toHaveBeenCalled();
    });

    it('should be changeHaveUnlockedDaysAction', () => {
      const fn = jest.fn();
      jest.spyOn(calendarService, 'haveUnlockedDays', 'set').mockImplementation(fn);
      component.changeHaveUnlockedDaysAction(true);
      expect(fn).toHaveBeenCalledWith(true);
    });

    it('should be book', () => {
      const fn = jest.fn();
      jest.spyOn(stateService, 'showModal').mockImplementation(fn);
      component.book('test');
      expect(fn).toHaveBeenCalled();
    });

    it('should be ngOnInit', () => {
      jest.spyOn(errorService, 'setAllTemplates');
      fixture.detectChanges();
      expect(errorService.setAllTemplates).toHaveBeenCalled();
    });
  });
  describe('base', () => {
    it('should be lockProvider$', (done) => {
      component.lockProvider$.subscribe((provider) => {
        expect(provider(new Date('2012-12-12'), new Date('2012-12-12'), 2)).toBeTruthy();
        expect(provider(new Date('2012-12-11'), new Date('2012-12-11'), 2)).toBeTruthy();
        expect(provider(new Date('2012-12-13'), new Date('2012-12-13'), 2)).toBeFalsy();
        done();
      });
    });
    it('should be listLoader', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      expect(stateService.setList).toHaveBeenCalledWith(testCase);
    });
    it('should be monthsLoader', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      expect(stateService.setMonths).toHaveBeenCalledWith(['2012-12']);
    });
  });
});
