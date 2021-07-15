import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatePeriodContainerComponent } from './date-period-container.component';
import { ScreenService } from '../../../../screen/screen.service';
import { configureTestSuite } from 'ng-bullet';
import { MockComponent, MockModule } from 'ng-mocks';
import { DefaultUniqueScreenWrapperModule } from '../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { CachedAnswersService } from '../../../../shared/services/cached-answers/cached-answers.service';
import {
  ConfigService,
  ConfigServiceStub, DATE_STRING_DASH_FORMAT,
  DatesToolsService,
  LocalStorageService,
  LocalStorageServiceStub
} from '@epgu/epgu-constructor-ui-kit';
import { DatePeriodComponent } from './date-period/date-period.component';
import { parseISO } from 'date-fns';

describe('DatePeriodContainerComponent', () => {
  let component: DatePeriodContainerComponent;
  let fixture: ComponentFixture<DatePeriodContainerComponent>;
  let screenService: ScreenService;
  let currentAnswersService: CurrentAnswersService;

  configureTestSuite(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatePeriodContainerComponent, MockComponent(DatePeriodComponent)],
      imports: [MockModule(DefaultUniqueScreenWrapperModule)],
      providers: [
        { provide: ScreenService, useClass: ScreenServiceStub },
        CurrentAnswersService,
        CachedAnswersService,
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
        DatesToolsService,
        { provide: ConfigService, useClass: ConfigServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    screenService = TestBed.inject(ScreenService);
    currentAnswersService = TestBed.inject(CurrentAnswersService);
    fixture = TestBed.createComponent(DatePeriodContainerComponent);
    component = fixture.componentInstance;
  });

  describe('updateState()', () => {

    it('updateState()', () => {
      component.updateState(
        { startDate: new Date('01.01.2020'), endDate: new Date('02.01.2020'), isValid: true });

      expect(currentAnswersService.isValid).toBe(true);
      expect(currentAnswersService.state).toBe('{"startDate":"2020-01-01","endDate":"2020-02-01"}');
    });

    it('updateState()', () => {
      component.updateState(
        { startDate: null, endDate: new Date('02.01.2020'), isValid: false });

      expect(currentAnswersService.isValid).toBe(false);
    });

  });

  describe('initialState', () => {
    jest.useFakeTimers();
    it('should be return time', () => {
      screenService.component = {
        id: 'w1',
        type: 'DatePeriod',
        label: '',
        attrs: {},
        value: '',
      };
      screenService.cachedAnswers = {
        w1: {
          visited: true,
          value: '{"startDate":"2020-01-01","endDate":"2020-02-01"}',
        },
      };
      fixture.detectChanges();
      component.initialState$.subscribe((value) => {
        expect(value.startDate).toEqual(parseISO('2020-01-01T00:00:00.000Z'));
      });

      jest.runAllTimers();
    });

    it('should be return start time values', () => {
      screenService.component = {
        id: 'w1',
        type: 'DatePeriod',
        label: '',
        attrs: {},
        value: '',
      };
      screenService.cachedAnswers = {};
      fixture.detectChanges();
      component.initialState$.subscribe((value) => {
        expect(value.endDate).toBeNull();
        expect(value.startDate).toBeNull();
      });

      jest.runAllTimers();
    });
  });
});
