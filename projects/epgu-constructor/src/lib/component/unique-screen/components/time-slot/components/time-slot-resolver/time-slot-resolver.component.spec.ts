import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSlotResolverComponent } from './time-slot-resolver.component';
import { MockComponent } from 'ng-mocks';

import { TimeSlotSmev2Component } from '../base/time-slot-smev2/time-slot-smev2.component';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';
import { TimeSlotSmev3ResolverComponent } from '../time-slot-smev3-resolver/time-slot-smev3-resolver.component';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('TimeSlotResolverComponent', () => {
  let component: TimeSlotResolverComponent;
  let fixture: ComponentFixture<TimeSlotResolverComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TimeSlotResolverComponent,
        MockComponent(TimeSlotSmev3ResolverComponent),
        MockComponent(TimeSlotSmev2Component),
      ],
      imports: [],
      providers: [
        {
          provide: ScreenService,
          useClass: ScreenServiceStub,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeSlotResolverComponent);
    component = fixture.componentInstance;
  });

  describe('base', () => {
    it('smev2 = true', () => {
      component.isSmev2$ = of(true);
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('epgu-constructor-time-slot-smev2'))).not.toBeNull();
    });
    it('smev2 = false', () => {
      component.isSmev2$ = of(false);
      fixture.detectChanges();
      expect(
        fixture.debugElement.query(By.css('epgu-constructor-time-slot-smev3-resolver')),
      ).not.toBeNull();
    });
  });
});
