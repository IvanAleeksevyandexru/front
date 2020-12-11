import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigationService } from '../../core/services/navigation/navigation.service';
import { CurrentAnswersService } from '../current-answers.service';
import { ComponentScreenComponent } from './component-screen.component';
import { ScreenContainerComponent } from '../../shared/components/screen-container/screen-container.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ScreenService } from '../screen.service';
import { MockComponents, MockDirective, MockModule } from 'ng-mocks';
import { PageNameComponent } from '../../shared/components/base/page-name/page-name.component';
import { ScreenPadComponent } from '../../shared/components/screen-pad/screen-pad.component';
// eslint-disable-next-line max-len
import { ConfirmPersonalUserAddressComponent } from '../../component/component-screen/components/confirm-personal-user/screens/confirm-personal-user-address-screen/components/confirm-personal-user-address/confirm-personal-user-address.component';
// eslint-disable-next-line max-len
import { ConfirmPersonalUserDataComponent } from '../../component/component-screen/components/confirm-personal-user/screens/confirm-personal-user-data-screen/component/confirm-personal-user-data/confirm-personal-user-data.component';
// eslint-disable-next-line max-len
import { ConfirmPersonalUserPhoneEmailComponent } from '../../component/component-screen/components/confirm-personal-user/screens/confirm-personal-user-phone-email/confirm-personal-user-phone-email.component';
// eslint-disable-next-line max-len
import { RegistrationAddrComponent } from '../../component/component-screen/components/confirm-personal-user/screens/registration-addr/components/registration-addr/registration-addr.component';
import { AddPassportComponent } from '../../component/component-screen/components/add-passport/add-passport.component';
import { CountrySelectionComponent } from '../../component/component-screen/components/country-selection/country-selection.component';
// eslint-disable-next-line max-len
import { SelectChildrenScreenComponent } from '../../component/component-screen/components/select-children/select-children-screen.component';
import { FieldListComponent } from '../../shared/components/field-list/field-list.component';
import { TimerComponent } from '../../component/component-screen/components/timer/timer.component';
import { ButtonComponent, EpguLibModule } from 'epgu-lib';
import { AnswerButtonComponent } from '../../shared/components/answer-button/answer-button.component';
import { ActionDirective } from '../../shared/directives/action/action.directive';
import { NavigationServiceStub } from '../../core/services/navigation/navigation.service.stub';
import { ScreenServiceStub } from '../screen.service.stub';
import { ComponentScreenComponentTypes } from '../../component/component-screen/component-screen-components.types';
import {
  ComponentActionDto,
  ComponentDto,
  DTOActionAction,
  ScenarioErrorsDto,
} from '../../form-player/services/form-player-api/form-player-api.types';
import { By } from '@angular/platform-browser';

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
          AddPassportComponent,
          CountrySelectionComponent,
          SelectChildrenScreenComponent,
          FieldListComponent,
          TimerComponent,
          AnswerButtonComponent,
        ),
        MockDirective(ActionDirective),
      ],
      providers: [
        CurrentAnswersService,
        { provide: NavigationService, useClass: NavigationServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    currentAnswersService = TestBed.inject(CurrentAnswersService);
    navigationService = TestBed.inject(NavigationService) as NavigationServiceStub;
    screenService = (TestBed.inject(ScreenService) as unknown) as ScreenServiceStub;
  });

  describe('isShowActionBtn property', () => {
    it('should be FALSE by default', () => {
      expect(component.isShowActionBtn).toBeFalsy();
    });
  });

  describe('componentData property', () => {
    it('should be NULL by default', () => {
      expect(component.componentData).toBeNull();
    });
  });

  describe('componentSetting property', () => {
    it('default value', () => {
      expect(component.componentSetting).toEqual({
        displayContinueBtn: true,
        displayWarningAnswers: false,
      });
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
      skipStepSpy = spyOn(navigationService.skipStep, 'next');
      nextStepSpy = spyOn(navigationService.nextStep, 'next');

      screenService.component = {
        attrs: {},
        id: 'id1',
        type: 'type1',
      };
      currentAnswersService.state = stateObj;
    });

    it('should call navigationService.skipStep.next() if action === "skipStep"', () => {
      component.nextStep('skipStep');

      expect(skipStepSpy).toBeCalledTimes(1);
      expect(nextStepSpy).not.toBeCalled();
    });

    it('should call navigationService.nextStep.next() if action !== "skipStep"', () => {
      component.nextStep();

      expect(skipStepSpy).not.toBeCalled();
      expect(nextStepSpy).toBeCalledTimes(1);
      nextStepSpy.calls.reset();

      component.nextStep('not skipStep');

      expect(skipStepSpy).not.toBeCalled();
      expect(nextStepSpy).toBeCalledTimes(1);
    });

    it('should call navigationService.nextStep.next with payload object', () => {
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

  describe('changedComponentData() method', () => {
    it('should set componentData property', () => {
      component.changedComponentData('foo');
      expect(component.componentData).toBe('foo');

      component.changedComponentData('bar');
      expect(component.componentData).toBe('bar');
    });
  });

  describe('changeComponentSettings() method', () => {
    it('should set componentSetting property', () => {
      expect(component.componentSetting).toEqual({
        displayContinueBtn: true,
        displayWarningAnswers: false,
      });

      component.changeComponentSettings({
        displayContinueBtn: false,
      });
      expect(component.componentSetting).toEqual({
        displayContinueBtn: false,
        displayWarningAnswers: false,
      });
    });
  });

  describe('isUserData() method', () => {
    it('should return screen content type or FALSE', () => {
      screenService.componentType = ComponentScreenComponentTypes.countryApostil;
      expect(component.isUserData()).toBeFalsy();

      screenService.componentType = ComponentScreenComponentTypes.confirmPersonalUserData;
      expect(component.isUserData()).toBe(ComponentScreenComponentTypes.confirmPersonalUserData);
    });
  });

  describe('isUserContactData() method', () => {
    it('should return screen content type or FALSE', () => {
      screenService.componentType = ComponentScreenComponentTypes.countryApostil;
      expect(component.isUserData()).toBeFalsy();

      screenService.componentType = ComponentScreenComponentTypes.confirmAnotherUserData;
      expect(component.isUserData()).toBe(ComponentScreenComponentTypes.confirmAnotherUserData);
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

  it('should render epgu-constructor-screen-container', () => {
    const selector = 'epgu-constructor-screen-container';

    const debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl).toBeTruthy();
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
    const selector = 'epgu-constructor-screen-container epgu-constructor-screen-pad';

    const debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl).toBeTruthy();
  });

  it('should render epgu-constructor-confirm-personal-user-address if componentType is confirmPersonalUserRegAddr', () => {
    const selector =
      'epgu-constructor-screen-container epgu-constructor-screen-pad epgu-constructor-confirm-personal-user-address';

    let debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl).toBeNull();

    screenService.componentType = ComponentScreenComponentTypes.confirmPersonalUserRegAddr;
    fixture.detectChanges();

    debugEl = fixture.debugElement.query(By.css(selector));
    expect(debugEl).toBeTruthy();

    expect(debugEl.componentInstance.data).toBeNull();

    screenService.component = componentDtoSample;
    fixture.detectChanges();

    expect(debugEl.componentInstance.data).toBe(componentDtoSample);
  });

  it('should render epgu-constructor-confirm-personal-user-data', () => {
    const selector =
      'epgu-constructor-screen-container epgu-constructor-screen-pad epgu-constructor-confirm-personal-user-data';

    let debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl).toBeNull();

    screenService.componentType = ComponentScreenComponentTypes.confirmPersonalUserData; // isUserData() returned value
    fixture.detectChanges();

    debugEl = fixture.debugElement.query(By.css(selector));
    expect(debugEl).toBeTruthy();

    expect(debugEl.componentInstance.data).toBeNull();

    screenService.component = componentDtoSample;
    fixture.detectChanges();

    expect(debugEl.componentInstance.data).toBe(componentDtoSample);
  });

  it('should render epgu-constructor-confirm-personal-user-phone-email', () => {
    const selector =
      'epgu-constructor-screen-container epgu-constructor-screen-pad epgu-constructor-confirm-personal-user-phone-email';

    let debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl).toBeNull();

    screenService.componentType = ComponentScreenComponentTypes.confirmPersonalUserPhone; // isUserContactData() returned value
    fixture.detectChanges();

    debugEl = fixture.debugElement.query(By.css(selector));
    expect(debugEl).toBeTruthy();

    expect(debugEl.componentInstance.data).toBeNull();
    expect(debugEl.componentInstance.errors).toBeNull();

    screenService.component = componentDtoSample;
    const errorsSample: ScenarioErrorsDto = {
      foo: 'bar',
    };
    screenService.componentErrors = errorsSample;
    fixture.detectChanges();

    expect(debugEl.componentInstance.data).toBe(componentDtoSample);
    expect(debugEl.componentInstance.errors).toBe(errorsSample);
  });

  it('should render epgu-constructor-registration-addr', () => {
    const selector =
      'epgu-constructor-screen-container epgu-constructor-screen-pad epgu-constructor-registration-addr';

    let debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl).toBeNull();

    screenService.componentType = ComponentScreenComponentTypes.registrationAddr;
    fixture.detectChanges();

    debugEl = fixture.debugElement.query(By.css(selector));
    expect(debugEl).toBeTruthy();

    expect(debugEl.componentInstance.data).toBeNull();
    expect(debugEl.componentInstance.error).toBeNull();

    screenService.component = componentDtoSample;
    screenService.componentError = 'foo';
    fixture.detectChanges();

    expect(debugEl.componentInstance.data).toBe(componentDtoSample);
    expect(debugEl.componentInstance.error).toBe('foo');
  });

  it('should render epgu-constructor-add-passport', () => {
    const selector =
      'epgu-constructor-screen-container epgu-constructor-screen-pad epgu-constructor-add-passport';

    let debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl).toBeNull();

    screenService.componentType = ComponentScreenComponentTypes.passportLookup;
    fixture.detectChanges();

    debugEl = fixture.debugElement.query(By.css(selector));
    expect(debugEl).toBeTruthy();

    expect(debugEl.componentInstance.data).toBeNull();

    screenService.component = componentDtoSample;
    fixture.detectChanges();

    expect(debugEl.componentInstance.data).toBe(componentDtoSample);
  });

  it('should render epgu-constructor-country-selection', () => {
    const selector =
      'epgu-constructor-screen-container epgu-constructor-screen-pad epgu-constructor-country-selection';

    let debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl).toBeNull();

    screenService.componentType = ComponentScreenComponentTypes.countryApostil;
    fixture.detectChanges();

    debugEl = fixture.debugElement.query(By.css(selector));
    expect(debugEl).toBeTruthy();

    expect(debugEl.componentInstance.data).toBeNull();

    screenService.component = componentDtoSample;
    fixture.detectChanges();

    expect(debugEl.componentInstance.data).toBe(componentDtoSample);
  });

  it('should call changeComponentSettings() on epgu-constructor-country-selection changeComponentSettings() event', () => {
    const selector =
      'epgu-constructor-screen-container epgu-constructor-screen-pad epgu-constructor-country-selection';

    screenService.componentType = ComponentScreenComponentTypes.countryApostil;
    fixture.detectChanges();

    let debugEl = fixture.debugElement.query(By.css(selector));

    const changeComponentSettingsSpy = spyOn(component, 'changeComponentSettings');

    debugEl.triggerEventHandler('changeComponentSettings', {
      displayContinueBtn: true,
    });

    expect(changeComponentSettingsSpy).toBeCalledTimes(1);
    expect(changeComponentSettingsSpy).toBeCalledWith({
      displayContinueBtn: true,
    });
  });

  it('should call changedComponentData() on epgu-constructor-country-selection changeComponentData() event', () => {
    const selector =
      'epgu-constructor-screen-container epgu-constructor-screen-pad epgu-constructor-country-selection';

    screenService.componentType = ComponentScreenComponentTypes.countryApostil;
    fixture.detectChanges();

    let debugEl = fixture.debugElement.query(By.css(selector));

    const changedComponentDataSpy = spyOn(component, 'changedComponentData');

    debugEl.triggerEventHandler('changeComponentData', 'foo');

    expect(changedComponentDataSpy).toBeCalledTimes(1);
    expect(changedComponentDataSpy).toBeCalledWith('foo');
  });

  it('should render epgu-constructor-select-children-screen (childrenListUnder14)', () => {
    const selector =
      'epgu-constructor-screen-container epgu-constructor-screen-pad epgu-constructor-select-children-screen';

    let debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl).toBeNull();

    screenService.componentType = ComponentScreenComponentTypes.childrenListUnder14;
    fixture.detectChanges();

    debugEl = fixture.debugElement.query(By.css(selector));
    expect(debugEl).toBeTruthy();

    expect(debugEl.componentInstance.data).toBeNull();

    screenService.component = componentDtoSample;
    fixture.detectChanges();

    expect(debugEl.componentInstance.data).toBe(componentDtoSample);
  });

  it('should call nextStep() on epgu-constructor-select-children-screen (childrenListUnder14) nextStepEvent() event', () => {
    const selector =
      'epgu-constructor-screen-container epgu-constructor-screen-pad epgu-constructor-select-children-screen';

    screenService.componentType = ComponentScreenComponentTypes.childrenListUnder14;
    fixture.detectChanges();

    const debugEl = fixture.debugElement.query(By.css(selector));

    const nextStepSpy = spyOn(component, 'nextStep');

    debugEl.triggerEventHandler('nextStepEvent', 'foo');

    expect(nextStepSpy).toBeCalledTimes(1);
    expect(nextStepSpy).toBeCalledWith(); // ignore arguments from nextStepEvent()
  });

  it('should render epgu-constructor-select-children-screen (childrenListAbove14)', () => {
    const selector =
      'epgu-constructor-screen-container epgu-constructor-screen-pad epgu-constructor-select-children-screen';

    let debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl).toBeNull();

    screenService.componentType = ComponentScreenComponentTypes.childrenListAbove14;
    fixture.detectChanges();

    debugEl = fixture.debugElement.query(By.css(selector));
    expect(debugEl).toBeTruthy();

    expect(debugEl.componentInstance.data).toBeNull();

    screenService.component = componentDtoSample;
    fixture.detectChanges();

    expect(debugEl.componentInstance.data).toBe(componentDtoSample);
  });

  it('should call nextStep() on epgu-constructor-select-children-screen (childrenListAbove14) nextStepEvent() event', () => {
    const selector =
      'epgu-constructor-screen-container epgu-constructor-screen-pad epgu-constructor-select-children-screen';

    screenService.componentType = ComponentScreenComponentTypes.childrenListAbove14;
    fixture.detectChanges();

    const debugEl = fixture.debugElement.query(By.css(selector));

    const nextStepSpy = spyOn(component, 'nextStep');

    debugEl.triggerEventHandler('nextStepEvent', 'foo');

    expect(nextStepSpy).toBeCalledTimes(1);
    expect(nextStepSpy).toBeCalledWith(); // ignore arguments from nextStepEvent()
  });

  it('should render epgu-constructor-field-list', () => {
    const selector =
      'epgu-constructor-screen-container epgu-constructor-screen-pad epgu-constructor-field-list';

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
      'epgu-constructor-screen-container epgu-constructor-screen-pad epgu-constructor-timer';

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

  it('should call nextStep() on epgu-constructor-timer nextStepEvent() event', () => {
    const selector =
      'epgu-constructor-screen-container epgu-constructor-screen-pad epgu-constructor-timer';

    screenService.componentType = ComponentScreenComponentTypes.timer;
    fixture.detectChanges();

    const debugEl = fixture.debugElement.query(By.css(selector));

    const nextStepSpy = spyOn(component, 'nextStep');

    debugEl.triggerEventHandler('nextStepEvent', 'foo');

    expect(nextStepSpy).toBeCalledTimes(1);
    expect(nextStepSpy).toBeCalledWith('foo');
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

  it('should render display continue button if componentSetting.displayContinueBtn is TRUE and screenService.submitLabel is TRUE', () => {
    const selector =
      'epgu-constructor-screen-container lib-button[data-testid="display-continue-btn"]';

    let debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl).toBeNull();

    screenService.submitLabel = 'foo';
    component.componentSetting.displayContinueBtn = false;
    fixture.detectChanges();

    expect(debugEl).toBeNull();

    component.componentSetting.displayContinueBtn = true;
    fixture.detectChanges();

    debugEl = fixture.debugElement.query(By.css(selector));
    expect(debugEl).toBeTruthy();

    expect(debugEl.componentInstance.showLoader).toBeFalsy();

    screenService.isLoadingSubject$.next(true);
    fixture.detectChanges();

    expect(debugEl.componentInstance.showLoader).toBeTruthy();

    currentAnswersService.isValid = false;
    screenService.isLoadingSubject$.next(true);
    fixture.detectChanges();

    expect(debugEl.componentInstance.disabled).toBeTruthy();

    currentAnswersService.isValid = false;
    screenService.isLoadingSubject$.next(false);
    fixture.detectChanges();

    expect(debugEl.componentInstance.disabled).toBeTruthy();

    currentAnswersService.isValid = true;
    screenService.isLoadingSubject$.next(false);
    fixture.detectChanges();

    expect(debugEl.componentInstance.disabled).toBeFalsy();

    expect(debugEl.nativeElement.textContent.trim()).toBe('foo');
  });

  it('should call nextStep() on display continue button click() event', () => {
    const selector =
      'epgu-constructor-screen-container lib-button[data-testid="display-continue-btn"]';

    screenService.submitLabel = 'foo';
    component.componentSetting.displayContinueBtn = true;
    fixture.detectChanges();

    const debugEl = fixture.debugElement.query(By.css(selector));

    const nextStepSpy = spyOn(component, 'nextStep');

    debugEl.triggerEventHandler('click', 'foo');

    expect(nextStepSpy).toBeCalledTimes(1);
    expect(nextStepSpy).toBeCalledWith(); // ignore arguments from click
  });

  it('should render displayWarningAnswersBtn if componentSetting.displayWarningAnswers is TRUE', () => {
    const selector = 'epgu-constructor-screen-container epgu-constructor-answer-button';

    let debugElements = fixture.debugElement.queryAll(By.css(selector));

    expect(debugElements.length).toBe(0);

    component.componentSetting.displayWarningAnswers = true;
    fixture.detectChanges();

    debugElements = fixture.debugElement.queryAll(By.css(selector));
    expect(debugElements.length).toBe(2);

    expect(debugElements[0].componentInstance.data).toEqual({
      label: 'Всё равно продолжить',
    });
    expect(debugElements[1].componentInstance.data).toEqual({
      label: 'Вернуться в личный кабинет',
    });
  });

  it('should call nextStep() on first displayWarningAnswers button click', () => {
    const selector = 'epgu-constructor-screen-container epgu-constructor-answer-button';

    component.componentSetting.displayWarningAnswers = true;
    fixture.detectChanges();

    const debugElements = fixture.debugElement.queryAll(By.css(selector));

    const nextStepSpy = spyOn(component, 'nextStep');

    debugElements[0].triggerEventHandler('click', 'foo');

    expect(nextStepSpy).toBeCalledTimes(1);
    expect(nextStepSpy).toBeCalledWith(); // ignore arguments from click
  });

  it('should call goToHomePage() on second displayWarningAnswers button click', () => {
    const selector = 'epgu-constructor-screen-container epgu-constructor-answer-button';

    component.componentSetting.displayWarningAnswers = true;
    fixture.detectChanges();

    const debugElements = fixture.debugElement.queryAll(By.css(selector));

    const goToHomePageSpy = spyOn(component, 'goToHomePage');

    debugElements[1].triggerEventHandler('click', 'foo');

    expect(goToHomePageSpy).toBeCalledTimes(1);
    expect(goToHomePageSpy).toBeCalledWith(); // ignore arguments from click
  });
});
