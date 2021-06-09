import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateTimePeriodContainerComponent } from './date-time-period-container.component';
import { configureTestSuite } from 'ng-bullet';
import { MockComponent, MockModule } from 'ng-mocks';
import { DateTimePeriodComponent } from '../date-time-period/date-time-period.component';
import { DefaultUniqueScreenWrapperModule } from '../../../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { CachedAnswersService } from '../../../../../../shared/services/cached-answers/cached-answers.service';
import { LocalStorageService, LocalStorageServiceStub } from '@epgu/epgu-constructor-ui-kit';

describe('DateTimePeriodContainerComponent', () => {
  let component: DateTimePeriodContainerComponent;
  let fixture: ComponentFixture<DateTimePeriodContainerComponent>;
  let screenService: ScreenService;

  configureTestSuite(async () => {
    await TestBed.configureTestingModule({
      declarations: [DateTimePeriodContainerComponent, MockComponent(DateTimePeriodComponent)],
      imports: [MockModule(DefaultUniqueScreenWrapperModule)],
      providers: [
        { provide: ScreenService, useClass: ScreenServiceStub },
        CurrentAnswersService,
        CachedAnswersService,
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    screenService = TestBed.inject(ScreenService);
    fixture = TestBed.createComponent(DateTimePeriodContainerComponent);
    component = fixture.componentInstance;
  });

  it('should be update currentAnswersService state', () => {
    component.updateState({} as any);
    expect(component.currentAnswersService.state).toBe('{}');
  });

  describe('initialState', () => {
    jest.useFakeTimers();
    it('should be return time', () => {
      screenService.component = {
        id: 'w1',
        type: 'DateTimePeriod',
        label: '',
        attrs: {},
        value: '',
      };
      screenService.cachedAnswers = {
        w1: {
          visited: true,
          value: JSON.stringify({
            startDateTime: '10.01.2021',
            endDateTime: '10.01.2022',
          }),
        },
      };
      fixture.detectChanges();
      component.initialState$.subscribe((value) => {
        expect(value.startDateTime).toBe('10.01.2021');
        expect(value.endDateTime).toBe('10.01.2022');
      });

      jest.runAllTimers();
    });

    it('should be return null time', () => {
      screenService.component = {
        id: 'w1',
        type: 'DateTimePeriod',
        label: '',
        attrs: {},
        value: '',
      };
      screenService.cachedAnswers = {};
      fixture.detectChanges();
      component.initialState$.subscribe((value) => {
        expect(value.startDateTime).toBeNull();
        expect(value.endDateTime).toBeNull();
      });

      jest.runAllTimers();
    });
  });
});
