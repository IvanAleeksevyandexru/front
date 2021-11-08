import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { TimeSlotCalendarComponent } from './time-slot-calendar.component';
import { CalendarModule } from '../../../../../../../shared/components/calendar/calendar.module';
import { MockModule } from 'ng-mocks';
import { DatesToolsService, DatesToolsServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { TimeSlotCalendarService } from '../../../services/calendar/time-slot-calendar.service';
import { ScreenService } from '../../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../../screen/screen.service.stub';

describe('TimeSlotCalendarComponent', () => {
  let component: TimeSlotCalendarComponent;
  let fixture: ComponentFixture<TimeSlotCalendarComponent>;
  let calendarService: TimeSlotCalendarService;

  configureTestSuite(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimeSlotCalendarComponent],
      imports: [MockModule(CalendarModule)],
      providers: [
        TimeSlotCalendarService,
        { provide: DatesToolsService, useClass: DatesToolsServiceStub },

        { provide: ScreenService, useClass: ScreenServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    calendarService = TestBed.inject(TimeSlotCalendarService);
    fixture = TestBed.createComponent(TimeSlotCalendarComponent);
    component = fixture.componentInstance;
  });

  describe('base', () => {
    it('should be addMonthRangeAction', () => {
      component.addMonthRangeAction('2012-12');
      expect(Array.from(calendarService.monthList.getValue())).toEqual(['2012-12']);
    });

    it('should be chooseAction', () => {
      jest.spyOn(component.choose, 'emit');
      component.chooseAction(new Date('2012-12-12'));
      expect(component.choose.emit).toHaveBeenCalled();
    });

    it('should be haveNotUnlockedDaysAction', () => {
      jest.spyOn(component.haveUnlockedDays, 'emit');
      component.haveNotUnlockedDaysAction(true);
      expect(component.haveUnlockedDays.emit).toHaveBeenCalled();
    });
  });
});
