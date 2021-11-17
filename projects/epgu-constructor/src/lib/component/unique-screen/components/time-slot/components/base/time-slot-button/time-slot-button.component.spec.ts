import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimeSlotButtonComponent } from './time-slot-button.component';
import { BaseModule } from '../../../../../../../shared/base.module';
import { FormsModule } from '@angular/forms';
import { ScreenService } from '../../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../../screen/screen.service.stub';
import { CurrentAnswersService } from '../../../../../../../screen/current-answers.service';
import { CurrentAnswersServiceStub } from '../../../../../../../screen/current-answers-service.stub';
import { TimeSlotStateService } from '../../../services/state/time-slot-state.service';
import { TimeSlotStateServiceStub } from '../../../services/state/time-slot-state.service.stub';
import {
  DatesToolsService,
  DatesToolsServiceStub,
  EventBusService,
  ModalService,
  ModalServiceStub,
  UnsubscribeService,
} from '@epgu/epgu-constructor-ui-kit';
import { ActionService } from '../../../../../../../shared/directives/action/action.service';
import { ActionServiceStub } from '../../../../../../../shared/directives/action/action.service.stub';
import { EVENT_TIMESLOT_BOOK, EVENT_TIMESLOT_BOOK_RESULT } from '../../../typings';
import { of } from 'rxjs';
import { ScreenButton } from '@epgu/epgu-constructor-types';
import { By } from '@angular/platform-browser';

const testId = 'testId';
const testButton = 'textButton';
describe('TimeSlotButtonComponent', () => {
  let component: TimeSlotButtonComponent;
  let fixture: ComponentFixture<TimeSlotButtonComponent>;
  let screenService: ScreenService;
  let eventService: EventBusService;
  let actionService: ActionService;
  let stateService: TimeSlotStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimeSlotButtonComponent],
      imports: [BaseModule, FormsModule],
      providers: [
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: CurrentAnswersService, useClass: CurrentAnswersServiceStub },
        { provide: DatesToolsService, useClass: DatesToolsServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: ActionService, useClass: ActionServiceStub },
        EventBusService,
        TimeSlotStateService,
        UnsubscribeService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    eventService = TestBed.inject(EventBusService);
    stateService = TestBed.inject(TimeSlotStateService);
    screenService = TestBed.inject(ScreenService);
    actionService = TestBed.inject(ActionService);
    screenService.component = { id: '123', attrs: {}, type: 'TimeSlots' };
    jest
      .spyOn(screenService, 'button$', 'get')
      .mockReturnValue(of(({ label: testButton } as unknown) as ScreenButton));

    fixture = TestBed.createComponent(TimeSlotButtonComponent);
    component = fixture.componentInstance;
    component.id = testId;
  });

  describe('base', () => {
    it('should be bookAction', (done) => {
      eventService.on(EVENT_TIMESLOT_BOOK).subscribe((id) => {
        expect(id).toBe(testId);
        done();
      });
      component.bookAction();
    });

    it('should be nextAction', () => {
      jest.spyOn(actionService, 'switchAction');
      component.nextAction();
      expect(actionService.switchAction).toHaveBeenCalled();
    });

    it('should be event - EVENT_TIMESLOT_BOOK_RESULT', async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      jest.spyOn(component, 'nextAction');
      eventService.emit(`${testId}${EVENT_TIMESLOT_BOOK_RESULT}`);
      expect(component.nextAction).toHaveBeenCalled();
    });

    it('text button', () => {
      fixture.detectChanges();
      expect(
        fixture.debugElement.query(By.css('.secondary-font'))?.nativeElement?.innerHTML?.trim(),
      ).toBe(testButton);
    });

    it('click button', () => {
      fixture.detectChanges();
      jest.spyOn(component, 'bookAction');
      fixture.debugElement.query(By.css('.submit-button'))?.nativeElement?.click();
      expect(component.bookAction).toHaveBeenCalled();
    });

    it('should be additionalDisplayingButton = true', () => {
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('.submit-button'))).not.toBeNull();
    });
    it('should be additionalDisplayingButton = false', () => {
      stateService.additionalDisplayingButton = false;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('.submit-button'))).toBeNull();
    });
  });
});
