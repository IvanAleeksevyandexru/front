import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockComponent } from 'ng-mocks';
import { InvitationErrorComponent } from '../../component/invitation-error-screen/components/error/invitation-error.component';
import { InvitationErrorScreenComponentTypes } from '../../component/invitation-error-screen/invitation-error-screen-components.types';
import { EventBusService } from '../../core/services/event-bus/event-bus.service';
import { NavigationService } from '../../core/services/navigation/navigation.service';
import { NavigationServiceStub } from '../../core/services/navigation/navigation.service.stub';
import { NavigationPayload } from '../../form-player/form-player.types';
import { ComponentDto } from '../../form-player/services/form-player-api/form-player-api.types';
import { CurrentAnswersService } from '../current-answers.service';
import { ScreenService } from '../screen.service';
import { ScreenServiceStub } from '../screen.service.stub';
import { ScreenStore } from '../screen.types';
import { InvitationErrorScreenComponent } from './invitation-error-screen.component';

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

// TODO: починить тесты

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
        EventBusService,
        CurrentAnswersService,
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
      screenService.componentType = InvitationErrorScreenComponentTypes.invitationError;
      initComponent();

      component.scenarioDto = scenarioDtoSample;
      spyOn(screenService, 'getStore').and.returnValue(scenarioDtoSample);

      expect(component.scenarioDto).toBe(scenarioDtoSample);
    });
  });

  xdescribe('epgu-constructor-invitation-error component', () => {
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
});
