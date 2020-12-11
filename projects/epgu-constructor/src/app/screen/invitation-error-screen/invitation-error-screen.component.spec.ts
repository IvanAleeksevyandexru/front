import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { NavigationService } from '../../core/services/navigation/navigation.service';
import { ScreenService } from '../screen.service';
import { ScreenServiceStub } from '../screen.service.stub';
import { ScreenStore } from '../screen.types';
import { InvitationErrorComponent } from '../../component/invitation-error-screen/components/error/invitation-error.component';
import { InvitationErrorScreenComponent } from './invitation-error-screen.component';
import { NavigationServiceStub } from '../../core/services/navigation/navigation.service.stub';
import { InvitationErrorScreenComponentTypes } from '../../component/invitation-error-screen/invitation-error-screen-components.types';
import { By } from '@angular/platform-browser';
import { ComponentDto } from '../../form-player/services/form-player-api/form-player-api.types';
import { NavigationPayload } from '../../form-player/form-player.types';

const componentDtoSample: ComponentDto = {
  attrs: {},
  id: 'id1',
  type: 'type1',
};

const scenarioDtoSample: ScreenStore = {
  token: 'some token',
};

const navigationPayloadSample: NavigationPayload = {
  foo: {
    visited: true,
    value: 'bar',
  },
};

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
      declarations: [InvitationErrorScreenComponent, MockComponent(InvitationErrorComponent)],
      providers: [
        { provide: NavigationService, useClass: NavigationServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    initComponent();

    navigationService = TestBed.inject(NavigationService) as NavigationServiceStub;
    screenService = (TestBed.inject(ScreenService) as unknown) as ScreenServiceStub;
  });

  describe('typeComponent property', () => {
    it('should be equal to InvitationErrorScreenComponentTypes by default', () => {
      expect(component.typeComponent).toBe(InvitationErrorScreenComponentTypes);
    });
  });

  describe('scenarioDto property', () => {
    it('should be equal to this.screenService.getStore()', () => {
      spyOn(screenService, 'getStore').and.returnValue(scenarioDtoSample);

      initComponent();

      expect(component.scenarioDto).toBe(scenarioDtoSample);
    });
  });

  describe('nextStep() method', () => {
    it('should call navigationService.next()', () => {
      const nextStepSpy = spyOn(navigationService, 'next');

      component.nextStep(navigationPayloadSample);

      expect(nextStepSpy).toBeCalledTimes(1);
      expect(nextStepSpy).toBeCalledWith({
        payload: navigationPayloadSample,
      });
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

    it('scenarioDto property should be equal to component.scenarioDto', () => {
      screenService.componentType = InvitationErrorScreenComponentTypes.invitationError;
      component.scenarioDto = scenarioDtoSample;
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.componentInstance.scenarioDto).toBe(scenarioDtoSample);
    });
  });

  it('should call nextStep() on epgu-constructor-invitation-error nextStepEvent() event', () => {
    const selector = 'epgu-constructor-invitation-error';

    screenService.componentType = InvitationErrorScreenComponentTypes.invitationError;
    fixture.detectChanges();

    const nextStepSpy = spyOn(component, 'nextStep');

    const debugEl = fixture.debugElement.query(By.css(selector));
    debugEl.triggerEventHandler('nextStepEvent', navigationPayloadSample);

    expect(nextStepSpy).toBeCalledTimes(1);
    expect(nextStepSpy).toBeCalledWith(navigationPayloadSample);
  });
});
