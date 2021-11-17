import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimeSlotErrorComponent } from './time-slot-error.component';
import { TimeSlotEmptyErrorComponent } from '../time-slot-error-templates/time-slot-empty-error/time-slot-empty-error.component';
import { TimeSlotCheckboxErrorComponent } from '../time-slot-error-templates/time-slot-checkbox-error/time-slot-checkbox-error.component';
import { BaseComponentsModule } from '../../../../../../../shared/components/base-components/base-components.module';
import { BaseModule } from '../../../../../../../shared/base.module';
import {
  ConstructorCheckboxModule,
  DatesToolsService,
  DatesToolsServiceStub,
  ModalService,
  ModalServiceStub,
} from '@epgu/epgu-constructor-ui-kit';
import { ScreenButtonsModule } from '../../../../../../../shared/components/screen-buttons/screen-buttons.module';
import { TimeSlotErrorService } from '../../../services/error/time-slot-error.service';

import { TimeSlotCalendarService } from '../../../services/calendar/time-slot-calendar.service';
import { CurrentAnswersService } from '../../../../../../../screen/current-answers.service';
import { CurrentAnswersServiceStub } from '../../../../../../../screen/current-answers-service.stub';
import { ScreenService } from '../../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../../screen/screen.service.stub';
import { TimeSlotSmev3StateService } from '../../../services/smev3-state/time-slot-smev3-state.service';
import { TimeSlotSmev3StateServiceStub } from '../../../services/smev3-state/time-slot-smev3-state.service.stub';
import { TimeSlotsConstants } from '../../../../time-slots/time-slots.constants';
import { TimeSlotTemplateType } from '../../../typings';
import { MockComponent } from 'ng-mocks';
import { By } from '@angular/platform-browser';

const mockTemplate = {
  header: 'test',
  description: 'test-description',
};

describe('TimeSlotErrorComponent', () => {
  let component: TimeSlotErrorComponent;
  let fixture: ComponentFixture<TimeSlotErrorComponent>;
  let calendarService: TimeSlotCalendarService;
  let errorService: TimeSlotErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TimeSlotErrorComponent,
        MockComponent(TimeSlotEmptyErrorComponent),
        MockComponent(TimeSlotCheckboxErrorComponent),
      ],
      imports: [BaseComponentsModule, BaseModule, ConstructorCheckboxModule, ScreenButtonsModule],
      providers: [
        TimeSlotErrorService,
        TimeSlotCalendarService,
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: CurrentAnswersService, useClass: CurrentAnswersServiceStub },
        { provide: DatesToolsService, useClass: DatesToolsServiceStub },
        { provide: TimeSlotSmev3StateService, useClass: TimeSlotSmev3StateServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        TimeSlotsConstants,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    errorService = TestBed.inject(TimeSlotErrorService);
    calendarService = TestBed.inject(TimeSlotCalendarService);
    calendarService.haveUnlockedDays$$.next(false);
    fixture = TestBed.createComponent(TimeSlotErrorComponent);
    component = fixture.componentInstance;
  });

  describe('base', () => {
    it('should be render DAYS_NOT_FOUND', () => {
      errorService.setTemplate(TimeSlotTemplateType.DAYS_NOT_FOUND, mockTemplate);
      fixture.detectChanges();
      expect(
        fixture.debugElement.query(By.css('epgu-constructor-time-slot-empty-error')),
      ).not.toBeNull();
    });
    it('should be render SLOTS_NOT_FOUND', () => {
      errorService.setTemplate(TimeSlotTemplateType.SLOTS_NOT_FOUND, mockTemplate);
      fixture.detectChanges();
      expect(
        fixture.debugElement.query(By.css('epgu-constructor-time-slot-checkbox-error')),
      ).not.toBeNull();
      fixture.detectChanges();
      expect(1).toBe(1);
    });
  });
});
