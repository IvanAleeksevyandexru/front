import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DateTimePeriodContainerComponent } from './date-time-period-container.component';
import { MockComponent, MockModule } from 'ng-mocks';
import { DateTimePeriodComponent } from '../date-time-period/date-time-period.component';
import { DefaultUniqueScreenWrapperModule } from '../../../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { CachedAnswersService } from '../../../../../../shared/services/cached-answers/cached-answers.service';
import { LocalStorageService, LocalStorageServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { By } from '@angular/platform-browser';
import { ComponentAttrsDto, DTOActionAction } from '@epgu/epgu-constructor-types';
import { JsonHelperService } from '../../../../../../core/services/json-helper/json-helper.service';

describe('DateTimePeriodContainerComponent', () => {
  let component: DateTimePeriodContainerComponent;
  let fixture: ComponentFixture<DateTimePeriodContainerComponent>;
  let screenService: ScreenServiceStub;

  const attrsSample = {
    daysToShow: 12,
    helperText: 'helper text',
    isMonthsRangeVisible: true,
    isSelectButtonHidden: false,
    label: 'label text',
    phoneNumber: 88008001000,
    placeholderText: 'placeholder text',
    visited: true,
    years: 2021,
  };

  const mockData = {
    endDateTime: '10.01.2022',
    startDateTime: '10.01.2021',
  };

  const defineInitialState = (attrs: ComponentAttrsDto, data: any) => {
    screenService.component = {
      id: 'w1',
      type: 'DateTimePeriod',
      label: '',
      attrs: attrs,
      value: '',
    };
    screenService.cachedAnswers = {
      w1: {
        visited: true,
        value: JSON.stringify(data),
      },
    };
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DateTimePeriodContainerComponent, MockComponent(DateTimePeriodComponent)],
      imports: [MockModule(DefaultUniqueScreenWrapperModule)],
      providers: [
        { provide: ScreenService, useClass: ScreenServiceStub },
        CurrentAnswersService,
        CachedAnswersService,
        JsonHelperService,
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    screenService = (TestBed.inject(ScreenService) as unknown) as ScreenServiceStub;
    fixture = TestBed.createComponent(DateTimePeriodContainerComponent);
    component = fixture.componentInstance;
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

  describe('epgu-constructor-default-unique-screen-wrapper', () => {
    const selector = 'epgu-constructor-default-unique-screen-wrapper';

    it('header should be screenService.header', () => {
      screenService.header = 'header text';
      fixture.detectChanges();
      const debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl.componentInstance.header).toBe('header text');
    });

    it('isLoading should be screenService.isLoading', () => {
      let debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl.componentInstance.isLoading).toBeFalsy();

      screenService.isLoadingSubject.next(true);
      fixture.detectChanges();
      debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl.componentInstance.isLoading).toBeTruthy();
    });

    it('screenButtons should be screenService.buttons', () => {
      const buttons = [
        {
          label: 'button1',
          action: DTOActionAction.getNextStep,
        },
        {
          label: 'button2',
          action: DTOActionAction.skipStep,
        },
      ];
      screenService.buttons = buttons;
      fixture.detectChanges();
      const debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl.componentInstance.screenButtons).toBe(buttons);
    });

    it('showNav should be screenService.showNav', () => {
      let debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl.componentInstance.showNav).toBeFalsy();

      screenService.showNav = true;
      fixture.detectChanges();
      debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl.componentInstance.showNav).toBeTruthy();
    });

    it('isValid should be currentAnswersService.isValid', () => {
      let debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl.componentInstance.isValid).toBeFalsy();

      component.currentAnswersService.isValid = true;
      fixture.detectChanges();
      debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl.componentInstance.isValid).toBeTruthy();
    });
  });

  describe('epgu-constructor-date-time-period', () => {
    const selector = 'epgu-constructor-date-time-period';

    it('should be rendered if initialState', () => {
      let debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl).toBeNull();

      defineInitialState(attrsSample, mockData);
      fixture.detectChanges();
      debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl).toBeTruthy();
    });

    it('attrs should be screenService.component.attrs', () => {
      defineInitialState(attrsSample, mockData);
      fixture.detectChanges();
      const debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl.componentInstance.attrs).toEqual(attrsSample);
    });

    it('step should be screenService.component.attrs.step', () => {
      const attrs = {
        ...attrsSample,
        step: 2,
      };
      defineInitialState(attrs, mockData);
      fixture.detectChanges();
      const debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl.componentInstance.attrs.step).toBe(2);
    });

    it('initialState should be value from component cachedAnswers', () => {
      defineInitialState(attrsSample, mockData);
      fixture.detectChanges();
      const debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl.componentInstance.initialState).toEqual(mockData);
    });

    it('should update currentAnswersSwervice state on updateState event', () => {
      defineInitialState(attrsSample, mockData);
      fixture.detectChanges();
      const debugEl = fixture.debugElement.query(By.css(selector));
      debugEl.triggerEventHandler('updateState', mockData);

      expect(component.currentAnswersService.state).toBe(JSON.stringify(mockData));
    });
  });
});
