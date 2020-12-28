import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { EpguLibModule } from 'epgu-lib';
import { MockComponents, MockDirective, MockModule } from 'ng-mocks';
import { WINDOW_PROVIDERS } from '../../core/providers/window.provider';
import { ConfigService } from '../../core/services/config/config.service';
import { ConfigServiceStub } from '../../core/services/config/config.service.stub';
import { LocationService } from '../../core/services/location/location.service';
import { NavigationService } from '../../core/services/navigation/navigation.service';
import { NavigationServiceStub } from '../../core/services/navigation/navigation.service.stub';
import { EventBusService } from '../../form-player/services/event-bus/event-bus.service';
import {
  ComponentActionDto,
  ComponentDto,
  DTOActionAction,
} from '../../form-player/services/form-player-api/form-player-api.types';
import { PageNameComponent } from '../../shared/components/base-components/page-name/page-name.component';
import { ScreenContainerComponent } from '../../shared/components/screen-container/screen-container.component';
import { ScreenPadComponent } from '../../shared/components/screen-pad/screen-pad.component';
import { ActionDirective } from '../../shared/directives/action/action.directive';
import { ScreenService } from '../screen.service';
import { ScreenServiceStub } from '../screen.service.stub';
import { InfoScreenBodyComponent } from './info-screen-body/info-screen-body.component';
import { InfoScreenComponent } from './info-screen.component';

const componentSample: ComponentDto = {
  attrs: {},
  id: 'id1',
  type: 'type1',
};

const componentActionDtoSample1: ComponentActionDto = {
  label: 'label1',
  value: 'value1',
  color: 'white',
  action: DTOActionAction.editEmail,
};

const componentActionDtoSample2: ComponentActionDto = {
  label: 'label2',
  value: 'value2',
  color: 'transparent',
  action: DTOActionAction.getNextStep,
};

describe('InfoScreenComponent', () => {
  let component: InfoScreenComponent;
  let fixture: ComponentFixture<InfoScreenComponent>;

  let navigationService: NavigationServiceStub;
  let screenService: ScreenServiceStub;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MockModule(EpguLibModule)],
      declarations: [
        InfoScreenComponent,
        MockComponents(
          ScreenContainerComponent,
          ScreenPadComponent,
          PageNameComponent,
          InfoScreenBodyComponent,
        ),
        MockDirective(ActionDirective),
      ],
      providers: [
        LocationService,
        WINDOW_PROVIDERS,
        { provide: NavigationService, useClass: NavigationServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        EventBusService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    navigationService = (TestBed.inject(NavigationService) as unknown) as NavigationServiceStub;
    screenService = (TestBed.inject(ScreenService) as unknown) as ScreenServiceStub;
  });

  describe('actionButtons property', () => {
    it('should be empty array by default', () => {
      expect(component.actionButtons).toEqual([]);
    });
  });

  describe('setActionButtons() method', () => {
    it('should set actionButtons property', () => {
      expect(component.actionButtons).toEqual([]);

      component.setActionButtons({
        attrs: {},
        id: 'id1',
        type: 'type1',
      });

      expect(component.actionButtons).toEqual([]);

      const actions = [
        {
          label: 'actionLabel1',
          value: 'actionValue1',
          action: DTOActionAction.editPhoneNumber,
        },
      ];

      component.setActionButtons({
        attrs: {
          actions: actions,
        },
        id: 'id1',
        type: 'type1',
      });

      expect(component.actionButtons).toEqual(actions);
    });
  });

  describe('nextStep() method', () => {
    it('should call navigationService.next()', () => {
      const nextStepSpy = spyOn(navigationService, 'next');

      component.nextStep();

      expect(nextStepSpy).toBeCalledTimes(1);
      expect(nextStepSpy).toBeCalledWith({});
    });
  });

  it('should set action buttons on screenService.component$ change', () => {
    const setActionButtonsSpy = spyOn(component, 'setActionButtons');

    screenService.component = componentSample;

    expect(setActionButtonsSpy).toBeCalledTimes(1);
    expect(setActionButtonsSpy).toBeCalledWith(componentSample);
  });

  describe('epgu-constructor-screen-container', () => {
    const selector = 'epgu-constructor-screen-container';

    it('should be rendered', () => {
      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeTruthy();
    });

    it('showNav property should be TRUE if screenService.showNav is TRUE, otherwise should be FALSE', () => {
      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.componentInstance.showNav).toBeFalsy();

      screenService.showNav = false;
      fixture.detectChanges();

      expect(debugEl.componentInstance.showNav).toBeFalsy();

      screenService.showNav = true;
      fixture.detectChanges();

      expect(debugEl.componentInstance.showNav).toBeTruthy();
    });
  });

  it('should render epgu-constructor-screen-pad', () => {
    const selector = 'epgu-constructor-screen-container epgu-constructor-screen-pad';

    const debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl).toBeTruthy();
  });

  it('should render epgu-constructor-page-name if screenService.header is not empty', () => {
    const selector =
      'epgu-constructor-screen-container epgu-constructor-screen-pad epgu-constructor-page-name';

    let debugEl = fixture.debugElement.query(By.css(selector));
    expect(debugEl).toBeNull();

    screenService.header = 'any';
    fixture.detectChanges();

    debugEl = fixture.debugElement.query(By.css(selector));
    expect(debugEl).toBeTruthy();

    expect(debugEl.nativeElement.textContent.trim()).toBe('any');
  });

  it('should render epgu-constructor-info-screen-body', () => {
    const selector =
      'epgu-constructor-screen-container epgu-constructor-screen-pad epgu-constructor-info-screen-body';

    const debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl).toBeTruthy();

    expect(debugEl.componentInstance.data).toBe(null);

    screenService.component = componentSample;
    fixture.detectChanges();

    expect(debugEl.componentInstance.data).toBe(componentSample);
  });

  it('should render lib-button[epgu-constructor-action] if actionButtons property is not empty', () => {
    const selector =
      'epgu-constructor-screen-container epgu-constructor-screen-pad lib-button[epgu-constructor-action]';

    let debugElements = fixture.debugElement.queryAll(By.css(selector));
    expect(debugElements.length).toBe(0);

    component.setActionButtons({
      attrs: {
        actions: [componentActionDtoSample1, componentActionDtoSample2],
      },
      id: 'id1',
      type: 'type1',
    });
    fixture.detectChanges();

    debugElements = fixture.debugElement.queryAll(By.css(selector));
    expect(debugElements.length).toBe(2);

    expect(debugElements[0].injector.get(ActionDirective).action).toBe(componentActionDtoSample1);
    expect(debugElements[0].nativeElement.textContent.trim()).toBe(componentActionDtoSample1.label);

    expect(debugElements[1].injector.get(ActionDirective).action).toBe(componentActionDtoSample2);
    expect(debugElements[1].nativeElement.textContent.trim()).toBe(componentActionDtoSample2.label);
  });

  describe('Submit button', () => {
    const selector = 'epgu-constructor-screen-container lib-button[data-testid="submit-btn"]';

    it('should be rendered if screenService.submitLabel is TRUE', () => {
      let debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeNull();

      screenService.submitLabel = 'any';
      fixture.detectChanges();

      debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeTruthy();
    });

    it('showLoader and disabled property should be equal screenService.isLoading', () => {
      screenService.submitLabel = 'any';
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.componentInstance.showLoader).toBeFalsy();
      expect(debugEl.componentInstance.disabled).toBeFalsy();

      screenService.isLoadingSubject$.next(true);
      fixture.detectChanges();

      expect(debugEl.componentInstance.showLoader).toBeTruthy();
      expect(debugEl.componentInstance.disabled).toBeTruthy();
    });
  });

  it('should call nextStep() on Submit button click() event', () => {
    const selector = 'epgu-constructor-screen-container lib-button[data-testid="submit-btn"]';

    screenService.submitLabel = 'any';
    fixture.detectChanges();

    const debugEl = fixture.debugElement.query(By.css(selector));

    const nextStepSpy = spyOn(component, 'nextStep');

    debugEl.triggerEventHandler('click', 'any');

    expect(nextStepSpy).toBeCalledTimes(1);
    expect(nextStepSpy).toBeCalledWith(); // ignore arguments from click event
  });

  it('should render lib-social-share', () => {
    const selector = 'epgu-constructor-screen-container lib-social-share';

    const debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl).toBeTruthy();

    expect(debugEl.componentInstance.isNewDesign).toBeTruthy();
    expect(debugEl.componentInstance.isNewDesignDisabled).toBeFalsy();
  });
});
