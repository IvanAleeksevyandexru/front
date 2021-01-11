import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { EpguLibModule } from 'epgu-lib';
import { MockComponents, MockDirective, MockModule } from 'ng-mocks';
import { ComponentScreenComponentTypes } from '../../component/component-screen/component-screen-components.types';
// eslint-disable-next-line max-len
import { AddPassportContainerComponent } from '../../component/component-screen/components/add-passport/container/add-passport-component-container.component';
// eslint-disable-next-line max-len
import { ConfirmPersonalUserAddressComponent } from '../../component/component-screen/components/confirm-personal-user/screens/confirm-personal-user-address-screen/components/confirm-personal-user-address/confirm-personal-user-address.component';
// eslint-disable-next-line max-len
import { ConfirmPersonalUserDataComponent } from '../../component/component-screen/components/confirm-personal-user/screens/confirm-personal-user-data-screen/component/confirm-personal-user-data/confirm-personal-user-data.component';
// eslint-disable-next-line max-len
import { ConfirmPersonalUserPhoneEmailComponent } from '../../component/component-screen/components/confirm-personal-user/screens/confirm-personal-user-phone-email/confirm-personal-user-phone-email.component';
// eslint-disable-next-line max-len
import { RegistrationAddrComponent } from '../../component/component-screen/components/confirm-personal-user/screens/registration-addr/components/registration-addr/registration-addr.component';
// eslint-disable-next-line max-len
import { SelectChildrenScreenComponent } from '../../component/component-screen/components/select-children/select-children-screen.component';
import { TimerComponent } from '../../component/component-screen/components/timer/timer.component';
import { NavigationService } from '../../core/services/navigation/navigation.service';
import { AnswerButtonComponent } from '../../shared/components/answer-button/answer-button.component';
import { ActionDirective } from '../../shared/directives/action/action.directive';
import { NavigationServiceStub } from '../../core/services/navigation/navigation.service.stub';
import { EventBusService } from '../../form-player/services/event-bus/event-bus.service';
import {
  ComponentActionDto,
  ComponentDto,
  DTOActionAction,
} from '../../form-player/services/form-player-api/form-player-api.types';
import { PageNameComponent } from '../../shared/components/base-components/page-name/page-name.component';
import { FieldListComponent } from '../../shared/components/field-list/field-list.component';
import { ScreenContainerComponent } from '../../shared/components/screen-container/screen-container.component';
import { ScreenPadComponent } from '../../shared/components/screen-pad/screen-pad.component';
import { CurrentAnswersService } from '../current-answers.service';
import { ScreenService } from '../screen.service';
import { ScreenServiceStub } from '../screen.service.stub';
import { ComponentScreenComponent } from './component-screen.component';
import { ChangeDetectionStrategy } from '@angular/core';

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

const componentDtoSample: ComponentDto = {
  attrs: {},
  id: 'id1',
  type: 'type1',
};

describe('ComponentScreenComponent', () => {
  let component: ComponentScreenComponent;
  let fixture: ComponentFixture<ComponentScreenComponent>;

  let currentAnswersService: CurrentAnswersService;
  let navigationService: NavigationServiceStub;
  let screenService: ScreenServiceStub;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MockModule(EpguLibModule)],
      declarations: [
        ComponentScreenComponent,
        MockComponents(
          ScreenContainerComponent,
          PageNameComponent,
          ScreenPadComponent,
          ConfirmPersonalUserAddressComponent,
          ConfirmPersonalUserDataComponent,
          ConfirmPersonalUserPhoneEmailComponent,
          RegistrationAddrComponent,
          AddPassportContainerComponent,
          SelectChildrenScreenComponent,
          FieldListComponent,
          TimerComponent,
          AnswerButtonComponent,
          ScreenPadComponent,
        ),
        MockDirective(ActionDirective),
      ],
      providers: [
        CurrentAnswersService,
        { provide: NavigationService, useClass: NavigationServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        EventBusService,
      ],
    }).overrideComponent(ComponentScreenComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    currentAnswersService = TestBed.inject(CurrentAnswersService);
    navigationService = (TestBed.inject(NavigationService) as unknown) as NavigationServiceStub;
    screenService = (TestBed.inject(ScreenService) as unknown) as ScreenServiceStub;
  });

  describe('isShowActionBtn property', () => {
    it('should be FALSE by default', () => {
      expect(component.isShowActionBtn).toBeFalsy();
    });
  });

  it('should call calcIsShowActionBtn on componentType change', () => {
    const setScreenComponentSpy = spyOn(component, 'calcIsShowActionBtn');

    screenService.componentType = ComponentScreenComponentTypes.confirmPersonalUserEmail;
    expect(setScreenComponentSpy).toBeCalledTimes(1);
    expect(setScreenComponentSpy).toBeCalledWith(
      ComponentScreenComponentTypes.confirmPersonalUserEmail,
    );
    setScreenComponentSpy.calls.reset();

    screenService.componentType = ComponentScreenComponentTypes.confirmPersonalUserPhone;
    expect(setScreenComponentSpy).toBeCalledTimes(1);
    expect(setScreenComponentSpy).toBeCalledWith(
      ComponentScreenComponentTypes.confirmPersonalUserPhone,
    );
  });

  describe('nextStep() method', () => {
    let skipStepSpy: jasmine.Spy;
    let nextStepSpy: jasmine.Spy;

    const stateObj: any = {
      foo: 'bar',
    };
    const stateJson = JSON.stringify(stateObj);

    beforeEach(() => {
      skipStepSpy = spyOn(navigationService, 'skip');
      nextStepSpy = spyOn(navigationService, 'next');

      screenService.component = {
        attrs: {},
        id: 'id1',
        type: 'type1',
      };
      currentAnswersService.state = stateObj;
    });

    it('should call navigationService.skip() if action === "skipStep"', () => {
      component.nextStep('skipStep');

      expect(skipStepSpy).toBeCalledTimes(1);
      expect(nextStepSpy).not.toBeCalled();
    });

    it('should call navigationService.next() if action !== "skipStep"', () => {
      component.nextStep();

      expect(skipStepSpy).not.toBeCalled();
      expect(nextStepSpy).toBeCalledTimes(1);
      nextStepSpy.calls.reset();

      component.nextStep('not skipStep');

      expect(skipStepSpy).not.toBeCalled();
      expect(nextStepSpy).toBeCalledTimes(1);
    });

    it('should call navigationService.next with payload object', () => {
      screenService.component = {
        attrs: {},
        id: 'id1',
        type: 'type1',
      };
      currentAnswersService.state = stateObj;

      component.nextStep('nextStep');

      // component.id === 'id1', state is object
      expect(nextStepSpy).toBeCalledWith({
        payload: {
          id1: {
            visited: true,
            value: stateJson, // value is always JSON
          },
        },
      });
      nextStepSpy.calls.reset();

      screenService.component = {
        attrs: {},
        id: 'id2',
        type: 'type1',
      };
      currentAnswersService.state = stateJson;

      component.nextStep('nextStep');

      // component.id === 'id2', state is JSON
      expect(nextStepSpy).toBeCalledWith({
        payload: {
          id2: {
            // id from screenService.component.id
            visited: true,
            value: stateJson, // value is always JSON
          },
        },
      });
    });

    it('should call navigationService.skipStep.next with payload object', () => {
      screenService.component = {
        attrs: {},
        id: 'id1',
        type: 'type1',
      };
      currentAnswersService.state = stateObj;

      component.nextStep('skipStep');

      // component.id === 'id1', state is object
      expect(skipStepSpy).toBeCalledWith({
        payload: {
          id1: {
            visited: true,
            value: stateJson, // value is always JSON
          },
        },
      });
      skipStepSpy.calls.reset();

      screenService.component = {
        attrs: {},
        id: 'id2',
        type: 'type1',
      };
      currentAnswersService.state = stateJson;

      component.nextStep('skipStep');

      // component.id === 'id2', state is JSON
      expect(skipStepSpy).toBeCalledWith({
        payload: {
          id2: {
            // id from screenService.component.id
            visited: true,
            value: stateJson, // value is always JSON
          },
        },
      });
    });
  });

  describe('calcIsShowActionBtn() method', () => {
    it('should set isShowActionBtn property', () => {
      component.calcIsShowActionBtn(ComponentScreenComponentTypes.childrenListAbove14);

      expect(component.isShowActionBtn).toBeFalsy();

      component.calcIsShowActionBtn(ComponentScreenComponentTypes.divorceConsent);

      expect(component.isShowActionBtn).toBeTruthy();
    });
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

  it('should render epgu-constructor-page-name if header is not empty', () => {
    const selector = 'epgu-constructor-screen-container epgu-constructor-page-name';

    let debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl).toBeNull();

    screenService.header = 'foo';
    fixture.detectChanges();

    debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl).toBeTruthy();

    expect(debugEl.nativeElement.textContent.trim()).toBe('foo');
  });

  it('should render epgu-constructor-screen-pad', () => {
    const selector = 'epgu-constructor-screen-container';

    const debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl).toBeTruthy();
  });

  it('should render epgu-constructor-confirm-personal-user-address if componentType is confirmPersonalUserRegAddr', () => {
    const selector =
      'epgu-constructor-screen-container epgu-constructor-confirm-personal-user-address';

    let debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl).toBeNull();

    screenService.componentType = ComponentScreenComponentTypes.confirmPersonalUserRegAddr;
    fixture.detectChanges();

    debugEl = fixture.debugElement.query(By.css(selector));
    expect(debugEl).toBeTruthy();
  });

  it('should render epgu-constructor-confirm-personal-user-data', () => {
    const selector =
      'epgu-constructor-screen-container epgu-constructor-confirm-personal-user-data';

    let debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl).toBeNull();

    screenService.componentType = ComponentScreenComponentTypes.confirmPersonalUserData; // isUserData() returned value
    fixture.detectChanges();

    debugEl = fixture.debugElement.query(By.css(selector));
    expect(debugEl).toBeTruthy();
  });

  it('should render epgu-constructor-confirm-personal-user-phone-email', () => {
    const selector =
      'epgu-constructor-screen-container epgu-constructor-confirm-personal-user-phone-email';

    let debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl).toBeNull();

    screenService.componentType = ComponentScreenComponentTypes.confirmPersonalUserPhone; // isUserContactData() returned value
    fixture.detectChanges();

    debugEl = fixture.debugElement.query(By.css(selector));
    expect(debugEl).toBeTruthy();
  });

  it('should render epgu-constructor-registration-addr', () => {
    const selector =
      'epgu-constructor-screen-container epgu-constructor-registration-addr';

    let debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl).toBeNull();

    screenService.componentType = ComponentScreenComponentTypes.registrationAddr;
    fixture.detectChanges();

    debugEl = fixture.debugElement.query(By.css(selector));
    expect(debugEl).toBeTruthy();
  });

  it('should render epgu-constructor-add-passport', () => {
    const selector =
      'epgu-constructor-screen-container epgu-constructor-add-passport-container';

    let debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl).toBeNull();

    screenService.componentType = ComponentScreenComponentTypes.passportLookup;
    fixture.detectChanges();

    debugEl = fixture.debugElement.query(By.css(selector));
    expect(debugEl).toBeTruthy();
  });

  it('should render epgu-constructor-select-children-screen (childrenListUnder14)', () => {
    const selector =
      'epgu-constructor-screen-container epgu-constructor-select-children-screen';

    let debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl).toBeNull();

    screenService.componentType = ComponentScreenComponentTypes.childrenListUnder14;
    fixture.detectChanges();

    debugEl = fixture.debugElement.query(By.css(selector));
    expect(debugEl).toBeTruthy();
  });

  it('should render epgu-constructor-select-children-screen (childrenListAbove14)', () => {
    const selector =
      'epgu-constructor-screen-container epgu-constructor-select-children-screen';

    let debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl).toBeNull();

    screenService.componentType = ComponentScreenComponentTypes.childrenListAbove14;
    fixture.detectChanges();

    debugEl = fixture.debugElement.query(By.css(selector));
    expect(debugEl).toBeTruthy();
  });

  it('should render epgu-constructor-field-list', () => {
    const selector =
      'epgu-constructor-screen-container epgu-constructor-field-list';

    let debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl).toBeNull();

    screenService.componentType = ComponentScreenComponentTypes.fieldList;
    fixture.detectChanges();

    debugEl = fixture.debugElement.query(By.css(selector));
    expect(debugEl).toBeTruthy();

    expect(debugEl.componentInstance.data).toBeNull();

    screenService.component = componentDtoSample;
    fixture.detectChanges();

    expect(debugEl.componentInstance.data).toBe(componentDtoSample);
  });

  it('should render epgu-constructor-timer', () => {
    const selector =
      'epgu-constructor-screen-container epgu-constructor-timer';

    let debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl).toBeNull();

    screenService.componentType = ComponentScreenComponentTypes.timer;
    fixture.detectChanges();

    debugEl = fixture.debugElement.query(By.css(selector));
    expect(debugEl).toBeTruthy();

    expect(debugEl.componentInstance.data).toBeNull();

    screenService.component = componentDtoSample;
    fixture.detectChanges();

    expect(debugEl.componentInstance.data).toBe(componentDtoSample);
  });

  it('should render action buttons if isShowActionBtn is TRUE', () => {
    const selector = 'epgu-constructor-screen-container lib-button[epgu-constructor-action]';

    let debugElements = fixture.debugElement.queryAll(By.css(selector));

    expect(debugElements.length).toBe(0);

    screenService.componentType = ComponentScreenComponentTypes.divorceConsent;
    fixture.detectChanges();

    debugElements = fixture.debugElement.queryAll(By.css(selector));
    expect(debugElements.length).toBe(0);

    screenService.actions = [componentActionDtoSample1, componentActionDtoSample2];
    fixture.detectChanges();

    debugElements = fixture.debugElement.queryAll(By.css(selector));

    expect(debugElements.length).toBe(2);

    expect(debugElements[0].injector.get(ActionDirective).action).toBe(componentActionDtoSample1);
    expect(debugElements[0].componentInstance.color).toBe(componentActionDtoSample1.color);
    expect(debugElements[0].nativeElement.textContent.trim()).toBe(componentActionDtoSample1.label);

    expect(debugElements[1].injector.get(ActionDirective).action).toBe(componentActionDtoSample2);
    expect(debugElements[1].componentInstance.color).toBe(componentActionDtoSample2.color);
    expect(debugElements[1].nativeElement.textContent.trim()).toBe(componentActionDtoSample2.label);
  });
});
