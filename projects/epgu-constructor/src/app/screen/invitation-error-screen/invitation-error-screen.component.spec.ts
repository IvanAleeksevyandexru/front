import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockComponent } from 'ng-mocks';
import { InvitationErrorComponent } from '../../component/invitation-error-screen/components/invitation-error/invitation-error.component';
import { InvitationErrorScreenComponentTypes } from '../../component/invitation-error-screen/invitation-error-screen-components.types';
import { EventBusService } from '../../core/services/event-bus/event-bus.service';
import { NavigationService } from '../../core/services/navigation/navigation.service';
import { NavigationServiceStub } from '../../core/services/navigation/navigation.service.stub';
import {
  ApplicantAnswersDto,
  ComponentDto,
} from '../../form-player/services/form-player-api/form-player-api.types';
import { CurrentAnswersService } from '../current-answers.service';
import { ScreenService } from '../screen.service';
import { ScreenServiceStub } from '../screen.service.stub';
import { InvitationErrorScreenComponent } from './invitation-error-screen.component';
import { ScreenBase } from '../screen-base';
import { LkInvitationInputComponent } from '../../component/invitation-error-screen/components/lk-Invitation-input/lk-invitation-input.component';
import { configureTestSuite } from 'ng-bullet';

const componentDtoSample: ComponentDto = {
  attrs: {},
  id: 'id1',
  type: 'type1',
};

const answerDtoSample: ApplicantAnswersDto = {
  test: {
    visited: true,
    value: 'string',
    disabled: true,
  },
};

const orderIdSample = 'desc';

const headerSample = 'Test header';

describe('InvitationErrorScreenComponent', () => {
  let component: InvitationErrorScreenComponent;
  let fixture: ComponentFixture<InvitationErrorScreenComponent>;

  let navigationService: NavigationServiceStub;
  let screenService: ScreenServiceStub;

  const initComponent = () => {
    fixture = TestBed.createComponent(InvitationErrorScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        InvitationErrorScreenComponent,
        MockComponent(InvitationErrorComponent),
        MockComponent(LkInvitationInputComponent),
      ],
      providers: [
        { provide: NavigationService, useClass: NavigationServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        EventBusService,
        CurrentAnswersService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    initComponent();

    navigationService = (TestBed.inject(NavigationService) as unknown) as NavigationServiceStub;
    screenService = (TestBed.inject(ScreenService) as unknown) as ScreenServiceStub;
  });

  describe('typeComponent property', () => {
    it('should be equal to InvitationErrorScreenComponentTypes by default', () => {
      expect(component.typeComponent).toBe(InvitationErrorScreenComponentTypes);
    });
  });

  describe('InvitationErrorScreenComponent', () => {
    it('should extend ScreenBase', () => {
      expect(component).toBeInstanceOf(ScreenBase);
    });
  });

  describe('epgu-constructor-invitation-error component', () => {
    const selector = 'epgu-constructor-invitation-error';

    it('should be rendered if screenService.componentType is invitationError', () => {
      let debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeNull();

      screenService.componentType = InvitationErrorScreenComponentTypes.invitationError;
      fixture.detectChanges();

      debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeTruthy();
    });

    it('data property should be equal to screenService.component', () => {
      screenService.componentType = InvitationErrorScreenComponentTypes.invitationError;
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.componentInstance.data).toBeNull();

      screenService.component = componentDtoSample;
      fixture.detectChanges();

      expect(debugEl.componentInstance.data).toBe(componentDtoSample);
    });

    it('applicantAnswers property should be equal to screenService.applicantAnswers', () => {
      screenService.componentType = InvitationErrorScreenComponentTypes.invitationError;
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.componentInstance.applicantAnswers).toBeNull();

      screenService.applicantAnswers = answerDtoSample;
      fixture.detectChanges();

      expect(debugEl.componentInstance.applicantAnswers).toBe(answerDtoSample);
    });

    it('orderId property should be equal to screenService.orderId', () => {
      screenService.componentType = InvitationErrorScreenComponentTypes.invitationError;
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.componentInstance.orderId).toBeNull();

      screenService.orderId = orderIdSample;
      fixture.detectChanges();

      expect(debugEl.componentInstance.orderId).toBe(orderIdSample);
    });

    it('header property should be equal to screenService.header', () => {
      screenService.componentType = InvitationErrorScreenComponentTypes.invitationError;
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.componentInstance.header).toBeNull();

      screenService.header = headerSample;
      fixture.detectChanges();

      expect(debugEl.componentInstance.header).toBe(headerSample);
    });
  });
});
