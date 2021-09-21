import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentDto } from '@epgu/epgu-constructor-types';
import {
  EventBusService,
  CoreUiModule,
  LocationService,
  ConfigService,
  ConfigServiceStub,
  UnsubscribeService,
} from '@epgu/epgu-constructor-ui-kit';

import { CoreModule } from '../../../../../core/core.module';
import { NavigationModalService } from '../../../../../core/services/navigation-modal/navigation-modal.service';
import { NavigationService } from '../../../../../core/services/navigation/navigation.service';
import { ScreenService } from '../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../screen/screen.service.stub';
import { BaseModule } from '../../../../../shared/base.module';
import { CounterDirective } from '../../../../../shared/directives/counter/counter.directive';
import { ConfirmEmailComponent } from './confirm-email.component';
import { MockModule, MockProvider } from 'ng-mocks';
import { NavigationServiceStub } from '../../../../../core/services/navigation/navigation.service.stub';
import { FormatTimeModule } from '@epgu/ui/pipes';

describe('ConfirmEmailComponent', () => {
  let component: ConfirmEmailComponent;
  let fixture: ComponentFixture<ConfirmEmailComponent>;
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
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmEmailComponent, CounterDirective],
      imports: [
        BaseModule,
        CoreModule,
        MockModule(CoreUiModule),
        RouterTestingModule,
        HttpClientTestingModule,
        FormatTimeModule,
      ],
      providers: [
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: NavigationService, useClass: NavigationServiceStub },
        MockProvider(UnsubscribeService),
        MockProvider(LocationService),
        MockProvider(EventBusService),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    navigationModalService = TestBed.inject(NavigationModalService);
    screenService = TestBed.inject(ScreenService);
    jest.spyOn(screenService, 'component', 'get').mockReturnValue(mockData);
    jest.useFakeTimers();
    fixture = TestBed.createComponent(ConfirmEmailComponent);
    component = fixture.componentInstance;

    fixture.debugElement.injector.get(ScreenService);
    fixture.debugElement.injector.get(UnsubscribeService);
    fixture.debugElement.injector.get(NavigationService);
  });

  it('should be call this.navModalService.next() after interval', () => {
    const navigationModalServiceNextFn = jest.spyOn(navigationModalService, 'next');
    jest.runTimersToTime(5000);

    expect(navigationModalServiceNextFn).toHaveBeenCalled();
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

  describe('resendEmailConfirmation()', () => {
    it('should be call this.navModalService.next()', () => {
      const navigationModalServiceNextFn = jest.spyOn(navigationModalService, 'next');
      component.resendEmailConfirmation();

      expect(navigationModalServiceNextFn).toHaveBeenCalled();
      expect(component.isTimerShow).toBe(true);
    });
  });
});
