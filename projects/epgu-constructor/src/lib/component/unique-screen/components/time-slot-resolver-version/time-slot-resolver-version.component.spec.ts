import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimeSlotResolverVersionComponent } from './time-slot-resolver-version.component';
import { BaseModule } from '../../../../shared/base.module';
import { TimeSlotsModule } from '../time-slots/time-slots.module';
import { TimeSlotModule } from '../time-slot/time-slot.module';
import { MockModule } from 'ng-mocks';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { BehaviorSubject } from 'rxjs';
import { ComponentDto } from '@epgu/epgu-constructor-types';
import { By } from '@angular/platform-browser';

describe('TimeSlotResolverVersionComponent', () => {
  let component: TimeSlotResolverVersionComponent;
  let fixture: ComponentFixture<TimeSlotResolverVersionComponent>;
  let screenService: ScreenService;
  let componentDTO$$ = new BehaviorSubject<ComponentDto>(({
    attrs: { newTimeSlotVersion: true },
  } as unknown) as ComponentDto);

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimeSlotResolverVersionComponent],
      imports: [MockModule(BaseModule), MockModule(TimeSlotsModule), MockModule(TimeSlotModule)],
      providers: [{ provide: ScreenService, useClass: ScreenServiceStub }],
    }).compileComponents();
  });

  beforeEach(() => {
    screenService = TestBed.inject(ScreenService);
    jest.spyOn(screenService, 'component$', 'get').mockReturnValue(componentDTO$$);
    fixture = TestBed.createComponent(TimeSlotResolverVersionComponent);
    component = fixture.componentInstance;
  });

  describe('base', () => {
    it('should be epgu-constructor-time-slot-screen', () => {
      fixture.detectChanges();

      expect(
        fixture.debugElement.query(By.css('epgu-constructor-time-slot-screen')),
      ).not.toBeNull();
    });

    it('should be epgu-constructor-time-slots', () => {
      componentDTO$$.next(({
        attrs: { newTimeSlotVersion: false },
      } as unknown) as ComponentDto);
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('epgu-constructor-time-slots'))).not.toBeNull();
    });
  });
});
