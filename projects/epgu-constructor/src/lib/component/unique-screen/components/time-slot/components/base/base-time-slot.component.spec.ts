import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseTimeSlotComponent } from './base-time-slot.component';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  EventBusService,
  HttpCancelService,
  ModalService,
  ModalServiceStub,
  UnsubscribeService,
} from '@epgu/epgu-constructor-ui-kit';
import { EVENT_TIMESLOT_BOOK, EVENT_TIMESLOT_BOOK_RESULT, Slot } from '../../typings';
import { TimeSlotStateService } from '../../services/state/time-slot-state.service';
import { TimeSlotStateServiceStub } from '../../services/state/time-slot-state.service.stub';
import { TimeSlotCalendarService } from '../../services/calendar/time-slot-calendar.service';
import { TimeSlotCalendarServiceStub } from '../../services/calendar/time-slot-calendar.service.stub';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';

@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
class TestTimeSlotComponent extends BaseTimeSlotComponent {
  // eslint-disable-next-line no-empty-function
  book(id?: string): void {}

  // eslint-disable-next-line no-empty-function
  changeHaveUnlockedDaysAction(status: boolean): void {}

  // eslint-disable-next-line no-empty-function
  changeSlot(slot: Slot): void {}
}

describe('BaseTimeSlotComponent', () => {
  let component: TestTimeSlotComponent;
  let fixture: ComponentFixture<TestTimeSlotComponent>;
  let screenService: ScreenService;
  let eventService: EventBusService;
  let httpCancelService: HttpCancelService;
  let stateService: TimeSlotStateService;

  const testId = 'testId';
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestTimeSlotComponent],
      imports: [],
      providers: [
        UnsubscribeService,
        HttpCancelService,
        EventBusService,
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: TimeSlotStateService, useClass: TimeSlotStateServiceStub },
        { provide: TimeSlotCalendarService, useClass: TimeSlotCalendarServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    stateService = TestBed.inject(TimeSlotStateService);
    eventService = TestBed.inject(EventBusService);
    httpCancelService = TestBed.inject(HttpCancelService);
    screenService = TestBed.inject(ScreenService);
    screenService.component = { id: '123', attrs: {}, type: 'TimeSlots' };
    fixture = TestBed.createComponent(TestTimeSlotComponent);
    component = fixture.componentInstance;
    component.id = 'testId';
  });

  describe('inheritance', () => {
    it('should be book', () => {
      jest.spyOn(component, 'book');
      fixture.detectChanges();
      eventService.emit(EVENT_TIMESLOT_BOOK, testId);
      expect(component.book).toHaveBeenCalledWith(testId);
    });

    it('should be changeMonthAction', () => {
      const testCase = '2012-12';
      jest.spyOn(stateService, 'setMonth');
      component.changeMonthAction(testCase);

      expect(stateService.setMonth).toHaveBeenCalledWith(testCase);
    });
    it('should be changeDayAction', () => {
      const testCase = new Date('2012-12-12');
      jest.spyOn(stateService, 'setDay');
      component.changeDayAction(testCase);

      expect(stateService.setDay).toHaveBeenCalledWith(testCase);
    });
    it('should be setResult', () => {
      const testCase = {};
      jest.spyOn(stateService, 'setResult');
      component.setResult(testCase);

      expect(stateService.setResult).toHaveBeenCalledWith(testCase);
    });

    it('should be httpCancel for onDestroy', () => {
      jest.spyOn(httpCancelService, 'cancelPendingRequests');
      component.ngOnDestroy();
      expect(httpCancelService.cancelPendingRequests).toHaveBeenCalled();
    });

    it('should be finish', (done) => {
      eventService.on(`${testId}${EVENT_TIMESLOT_BOOK_RESULT}`).subscribe(() => {
        expect(1).toBe(1);
        done();
      });
      component.finish(testId);
    });
  });
});
