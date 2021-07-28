import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { MockModule } from 'ng-mocks';

import { DateRangeService } from '../../../../../shared/services/date-range/date-range.service';
import { CoreModule } from '../../../../../core/core.module';
import { CoreUiModule, DatesToolsService } from '@epgu/epgu-constructor-ui-kit';
import {
  ConfigService,
  ConfigServiceStub,
  EventBusService,
  LoggerService,
  LoggerServiceStub
} from '@epgu/epgu-constructor-ui-kit';
import { NavigationModalService } from '../../../../../core/services/navigation-modal/navigation-modal.service';
import { NavigationService } from '../../../../../core/services/navigation/navigation.service';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../screen/screen.service.stub';
import { BaseModule } from '../../../../../shared/base.module';
import { ConstructorPlainInputModule } from '../../../../../shared/components/constructor-plain-input/constructor-plain-input.module';
import { CounterDirective } from '../../../../../shared/directives/counter/counter.directive';
import { ValidationService } from '../../../../../shared/services/validation/validation.service';
import { ConfirmWithCodeComponent } from './confirm-with-code.component';
import { ApplicantAnswersDto, ComponentDto } from '@epgu/epgu-constructor-types';
import { DateRestrictionsService } from '../../../../../shared/services/date-restrictions/date-restrictions.service';

describe('ConfirmWithCodeComponent', () => {
  let component: ConfirmWithCodeComponent;
  let fixture: ComponentFixture<ConfirmWithCodeComponent>;
  let navigationModalService: NavigationModalService;
  let screenService: ScreenService;
  const mockData: ComponentDto = {
    id: '',
    value: '',
    type: '',
    label: '',
    visited: true,
    required: true,
    attrs: {
      characterMask: '\\d',
      codeLength: 4,
      resendCodeUrl: 'url',
    },
  };

  const applicantAnswersDto: ApplicantAnswersDto = {
    pd1: { value: '', visited: false },
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmWithCodeComponent, CounterDirective],
      imports: [ConstructorPlainInputModule, CoreModule, MockModule(CoreUiModule), BaseModule, RouterTestingModule],
      providers: [
        UnsubscribeService,
        NavigationService,
        NavigationModalService,
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: LoggerService, useClass: LoggerServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        ValidationService,
        EventBusService,
        DateRangeService,
        DatesToolsService,
        DateRestrictionsService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    navigationModalService = TestBed.inject(NavigationModalService);
    screenService = TestBed.inject(ScreenService);
    jest.spyOn(screenService, 'component', 'get').mockReturnValue(mockData);
    jest.spyOn(screenService, 'component$', 'get').mockReturnValue(of(mockData));
    jest.spyOn(screenService, 'applicantAnswers', 'get').mockReturnValue(applicantAnswersDto);
    fixture = TestBed.createComponent(ConfirmWithCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('sendCodeAgain()', () => {
    it('should be call this.navModalService.next()', () => {
      const navigationModalServiceNextFn = jest.spyOn(navigationModalService, 'next');
      component.sendCodeAgain();

      expect(navigationModalServiceNextFn).toHaveBeenCalled();
      expect(component.isTimerShow).toBe(true);
    });
  });

  describe('enterCode()', () => {
    it('should be call this.navModalService.next()', () => {
      const navigationModalServiceNextFn = jest.spyOn(navigationModalService, 'next');
      component.enterCode('1234');

      expect(navigationModalServiceNextFn).toHaveBeenCalled();
    });

    it('should be not call this.navModalService.next()', () => {
      const navigationModalServiceNextFn = jest.spyOn(navigationModalService, 'next');
      component.enterCode('1');

      expect(navigationModalServiceNextFn).not.toHaveBeenCalled();
    });
    it('check lastCode', () => {
      component.lastCode = '1234';
      const navigationModalServiceNextFn = jest.spyOn(navigationModalService, 'next');
      component.enterCode('1234');

      expect(navigationModalServiceNextFn).not.toHaveBeenCalled();
    });
  });

  describe('timerChange()', () => {
    it('should be change this.timer', () => {
      const timer = 4;
      component.timerChange(timer);

      expect(component.timer).toBe(timer);
    });

    it('should be change this.isTimerShow', () => {
      component.timerChange(0);

      expect(component.isTimerShow).toBe(false);
    });
  });

  describe('editNumber()', () => {
    it('should be call this.navModalService.prev()', () => {
      const navigationModalServicePrevFn = jest.spyOn(navigationModalService, 'prev');
      component.editNumber();

      expect(navigationModalServicePrevFn).toHaveBeenCalled();
    });
  });

  describe('next focus', () => {
    it('next focus number for null', () => {
      const focusToElementFn = jest.spyOn(component, 'focusToElement');
      const nextIndex = 1;
      component.codeFormArray.value[nextIndex].codeValue = null;
      component.focusIndex(nextIndex);
      expect(focusToElementFn).toHaveBeenCalled();
    });

    it('not next focus number for not empty', () => {
      const focusToElementFn = jest.spyOn(component, 'focusToElement');
      const nextIndex = 1;
      component.codeFormArray.value[nextIndex].codeValue = '2';
      component.focusIndex(nextIndex);
      expect(focusToElementFn).not.toHaveBeenCalled();
    });
  });
});
