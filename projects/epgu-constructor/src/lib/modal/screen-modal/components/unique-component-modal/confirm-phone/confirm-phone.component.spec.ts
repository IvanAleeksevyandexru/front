import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DateRangeService } from '../../../../../shared/services/date-range/date-range.service';
import { CoreModule } from '../../../../../core/core.module';
import { DatesToolsService } from '../../../../../core/services/dates-tools/dates-tools.service';
import { EventBusService } from '../../../../../core/services/event-bus/event-bus.service';
import { NavigationModalService } from '../../../../../core/services/navigation-modal/navigation-modal.service';
import { NavigationService } from '../../../../../core/services/navigation/navigation.service';
import { UnsubscribeService } from '../../../../../core/services/unsubscribe/unsubscribe.service';
import { ScreenService } from '../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../screen/screen.service.stub';
import { BaseModule } from '../../../../../shared/base.module';
import { ConstructorPlainInputModule } from '../../../../../shared/components/constructor-plain-input/constructor-plain-input.module';
import { CounterDirective } from '../../../../../shared/directives/counter/counter.directive';
import { ValidationService } from '../../../../../shared/services/validation/validation.service';
import { ConfirmPhoneComponent } from './confirm-phone.component';
import { configureTestSuite } from 'ng-bullet';
import { ApplicantAnswersDto, ComponentDto } from '@epgu/epgu-constructor-types';
import { of } from 'rxjs';
import { DateRestrictionsService } from '../../../../../shared/services/date-restrictions/date-restrictions.service';

describe('ConfirmPhoneComponent', () => {
  let component: ConfirmPhoneComponent;
  let fixture: ComponentFixture<ConfirmPhoneComponent>;
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
      characterMask: [],
      codeLength: 4,
      resendCodeUrl: 'url',
    },
  };

  const applicantAnswersDto: ApplicantAnswersDto = {
    pd1: { value: '', visited: false },
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmPhoneComponent, CounterDirective],
      imports: [ConstructorPlainInputModule, CoreModule, BaseModule, RouterTestingModule],
      providers: [
        UnsubscribeService,
        NavigationService,
        NavigationModalService,
        { provide: ScreenService, useClass: ScreenServiceStub },
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
    fixture = TestBed.createComponent(ConfirmPhoneComponent);
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
