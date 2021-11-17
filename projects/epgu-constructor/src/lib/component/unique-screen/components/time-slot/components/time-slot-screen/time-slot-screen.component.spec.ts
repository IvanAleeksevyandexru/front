import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimeSlotScreenComponent } from './time-slot-screen.component';
import { FormsModule } from '@angular/forms';
import { BaseModule } from '../../../../../../shared/base.module';
import { ScreenContainerModule, ScreenPadModule } from '@epgu/epgu-constructor-ui-kit';
import { BaseComponentsModule } from '../../../../../../shared/components/base-components/base-components.module';
import { TimeSlotBaseScreenComponent } from '../base/time-slot-base-screen/time-slot-base-screen.component';
import { MockComponent } from 'ng-mocks';
import { TimeSlotResolverComponent } from '../time-slot-resolver/time-slot-resolver.component';
import { TimeSlotErrorComponent } from '../base/time-slot-error/time-slot-error.component';
import { TimeSlotBookedInfoComponent } from '../base/time-slot-booked-info/time-slot-booked-info.component';
import { TimeSlotButtonComponent } from '../base/time-slot-button/time-slot-button.component';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('TimeSlotScreenComponent', () => {
  let component: TimeSlotScreenComponent;
  let fixture: ComponentFixture<TimeSlotScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TimeSlotScreenComponent,
        TimeSlotBaseScreenComponent,
        MockComponent(TimeSlotResolverComponent),
        MockComponent(TimeSlotErrorComponent),
        MockComponent(TimeSlotBookedInfoComponent),
        MockComponent(TimeSlotButtonComponent),
      ],
      imports: [
        FormsModule,
        BaseModule,
        ScreenContainerModule,
        BaseComponentsModule,
        ScreenPadModule,
      ],
      providers: [{ provide: ScreenService, useClass: ScreenServiceStub }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeSlotScreenComponent);
    component = fixture.componentInstance;
  });

  describe('base', () => {
    it('should be showNav', () => {
      component.showNav$ = of(false);
      fixture.detectChanges();
      expect(
        fixture.debugElement.query(By.css('epgu-constructor-time-slot-base-screen'))
          .componentInstance.showNav,
      ).toBe(false);
    });
    it('should be header', () => {
      component.header$ = of('str');
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('h1'))?.nativeElement?.innerHTML?.trim()).toBe(
        'str',
      );
    });
  });
});
