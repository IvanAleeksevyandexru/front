import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { ApplicantAnswersDto, ComponentDto } from '@epgu/epgu-constructor-types';
import { CurrentAnswersService } from '../current-answers.service';
import { CurrentAnswersServiceStub } from '../current-answers-service.stub';
import { EventBusService, EventBusServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { InvitationComponent } from '../../component/invitation-error-screen/components/invitation/invitation.component';
import { InvitationErrorScreenComponent } from './invitation-error-screen.component';
import { InvitationTypes } from '../../component/invitation-error-screen/invitation.types';
import { NavigationService } from '../../core/services/navigation/navigation.service';
import { NavigationServiceStub } from '../../core/services/navigation/navigation.service.stub';
import { ScreenBase } from '../screen-base';
import { ScreenService } from '../screen.service';
import { ScreenServiceStub } from '../screen.service.stub';

const componentDtoSample: ComponentDto = {
  attrs: {},
  id: 'id1',
  type: 'type1',
};

const componentTypeSample: InvitationTypes = InvitationTypes.invitationError;

const answerDtoSample: ApplicantAnswersDto = {
  test: {
    visited: true,
    value: 'string',
    disabled: true,
  },
};

const orderIdSample = 123456789;

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        InvitationErrorScreenComponent,
        MockComponent(InvitationComponent),
      ],
      providers: [
        { provide: CurrentAnswersService, useClass: CurrentAnswersServiceStub },
        { provide: EventBusService, useClass: EventBusServiceStub },
        { provide: NavigationService, useClass: NavigationServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    initComponent();

    navigationService = (TestBed.inject(NavigationService) as unknown) as NavigationServiceStub;
    screenService = (TestBed.inject(ScreenService) as unknown) as ScreenServiceStub;
  });

  describe('typeComponent property', () => {
    it('should be equal to InvitationTypes by default', () => {
      expect(component.typeComponent).toBe(InvitationTypes);
    });
  });

  describe('InvitationErrorScreenComponent', () => {
    it('should extend ScreenBase', () => {
      expect(component).toBeInstanceOf(ScreenBase);
    });
  });

  describe('epgu-constructor-invitation component', () => {
    const selector = 'epgu-constructor-invitation';

    it('properties should be equal to screenService data', () => {
      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.componentInstance.componentType).toBeNull();

      screenService.componentType = componentTypeSample;
      fixture.detectChanges();

      expect(debugEl.componentInstance.componentType).toBe(componentTypeSample);

      expect(debugEl.componentInstance.applicantAnswers).toBeNull();
      expect(debugEl.componentInstance.data).toBeNull();
      expect(debugEl.componentInstance.header).toBeNull();
      expect(debugEl.componentInstance.orderId).toBeNull();

      screenService.applicantAnswers = answerDtoSample;
      screenService.component = componentDtoSample;
      screenService.header = headerSample;
      screenService.orderId = orderIdSample;
      fixture.detectChanges();

      expect(debugEl.componentInstance.applicantAnswers).toBe(answerDtoSample);
      expect(debugEl.componentInstance.data).toBe(componentDtoSample);
      expect(debugEl.componentInstance.header).toBe(headerSample);
      expect(debugEl.componentInstance.orderId).toBe(orderIdSample);
    });
  });
});
