import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { TimeSlotMonthComponent } from './time-slot-month.component';
import { MockModule } from 'ng-mocks';
import { CalendarModule } from '../../../../../../../shared/components/calendar/calendar.module';
import { DatesToolsService, DatesToolsServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { TimeSlotCalendarService } from '../../../services/calendar/time-slot-calendar.service';
import { TimeSlotCalendarServiceStub } from '../../../services/calendar/time-slot-calendar.service.stub';
import { of } from 'rxjs';
import { ScreenService } from '../../../../../../../screen/screen.service';
import { ComponentDto } from '@epgu/epgu-constructor-types';
import { ListItem } from '@epgu/ui/models/dropdown';

describe('TimeSlotMonthComponent', () => {
  let component: TimeSlotMonthComponent;
  let fixture: ComponentFixture<TimeSlotMonthComponent>;
  let calendarService: TimeSlotCalendarService;
  let screenService: ScreenService;
  configureTestSuite(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimeSlotMonthComponent],
      imports: [MockModule(CalendarModule)],
      providers: [
        { provide: DatesToolsService, useClass: DatesToolsServiceStub },
        { provide: TimeSlotCalendarService, useClass: TimeSlotCalendarServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    screenService = TestBed.inject(ScreenService);
    jest
      .spyOn(screenService, 'component$', 'get')
      .mockReturnValue(
        of(({ id: '123', attrs: {}, type: 'TimeSlots' } as unknown) as ComponentDto),
      );

    calendarService = TestBed.inject(TimeSlotCalendarService);
    calendarService.refDate$ = of(new Date());
    fixture = TestBed.createComponent(TimeSlotMonthComponent);
    component = fixture.componentInstance;
  });

  describe('base', () => {
    it('should be chooseAction', () => {
      jest.spyOn(component.choose, 'emit');
      component.chooseAction(new ListItem({ id: '2012-12', text: '2012-12' }));
      expect(component.choose.emit).toHaveBeenCalled();
    });
  });
});
