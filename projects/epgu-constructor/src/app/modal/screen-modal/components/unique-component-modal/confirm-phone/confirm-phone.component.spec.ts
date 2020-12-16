import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ConfirmPhoneComponent } from './confirm-phone.component';
import { ScreenService } from '../../../../../screen/screen.service';
import { UnsubscribeService } from '../../../../../core/services/unsubscribe/unsubscribe.service';
import { NavigationService } from '../../../../../core/services/navigation/navigation.service';
import { ScreenServiceStub } from '../../../../../screen/screen.service.stub';
import { NavigationModalService } from '../../../../../core/services/navigation-modal/navigation-modal.service';
import { ConstructorPlainInputModule } from '../../../../../shared/components/constructor-plain-input/constructor-plain-input.module';
import { CoreModule } from '../../../../../core/core.module';
import {
  ApplicantAnswersDto,
  ComponentDto,
} from '../../../../../form-player/services/form-player-api/form-player-api.types';
import { CounterDirective } from '../../../../../shared/directives/counter/counter.directive';
import { ValidationService } from '../../../../../shared/services/validation/validation.service';

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmPhoneComponent, CounterDirective],
      imports: [ConstructorPlainInputModule, CoreModule, RouterTestingModule],
      providers: [
        UnsubscribeService,
        NavigationService,
        NavigationModalService,
        { provide: ScreenService, useClass: ScreenServiceStub },
        ValidationService
      ],
    }).compileComponents();

    navigationModalService = TestBed.inject(NavigationModalService);
    screenService = TestBed.inject(ScreenService);
    jest.spyOn(screenService, 'component', 'get').mockReturnValue(mockData);
    jest.spyOn(screenService, 'applicantAnswers', 'get').mockReturnValue(applicantAnswersDto);
  });

  beforeEach(() => {
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
});
