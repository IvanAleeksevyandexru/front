import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockComponents, MockDirective, MockModule, MockPipe, MockProvider } from 'ng-mocks';
import {
  ConfigService,
  DeviceDetectorService,
  DeviceDetectorServiceStub,
  SessionService,
  JsonHelperService,
  JsonHelperServiceStub,
  ConfigServiceStub,
  EventBusService,
  LocationService,
  WINDOW_PROVIDERS,
  ModalService,
  ModalServiceStub,
  ScreenContainerComponent,
  ImgPrefixerPipe,
} from '@epgu/epgu-constructor-ui-kit';

import {
  NavigationPayload,
  ComponentDto,
  ActionType,
  ComponentActionDto,
  DTOActionAction,
  Clarifications,
} from '@epgu/epgu-constructor-types';
import { NavigationService } from '../../core/services/navigation/navigation.service';
import { NavigationServiceStub } from '../../core/services/navigation/navigation.service.stub';

import { AnswerButtonComponent } from '../../shared/components/answer-button/answer-button.component';
import { PageNameComponent } from '../../shared/components/base-components/page-name/page-name.component';

import { ActionDirective } from '../../shared/directives/action/action.directive';

import { CurrentAnswersService } from '../current-answers.service';
import { ScreenService } from '../screen.service';
import { ScreenServiceStub } from '../screen.service.stub';
import { QuestionsScreenComponent } from './questions-screen.component';
import { UserInfoLoaderModule } from '../../shared/components/user-info-loader/user-info-loader.module';
import { ScreenButtonsModule } from '../../shared/components/screen-buttons/screen-buttons.module';
import { BaseModule } from '../../shared/base.module';
import { ActionService } from '../../shared/directives/action/action.service';
import { ActionServiceStub } from '../../shared/directives/action/action.service.stub';

import { HtmlSelectService } from '../../core/services/html-select/html-select.service';
import { ActionToolsService } from '../../shared/directives/action/action-tools.service';

const componentDtoSample: ComponentDto = {
  attrs: {},
  id: 'id1',
  type: 'type1',
};

const componentActionDtoSample1: ComponentActionDto = {
  label: 'actionLabel1',
  value: 'actionValue1',
  action: DTOActionAction.editPhoneNumber,
  type: ActionType.profileEdit,
};

const componentActionDtoSample2: ComponentActionDto = {
  label: 'actionLabel2',
  value: 'actionValue2',
  action: DTOActionAction.editPhoneNumber,
  type: ActionType.profileEdit,
};

const navigationPayloadSample: NavigationPayload = {
  foo: {
    visited: true,
    value: 'bar',
  },
};

const clarificationsSample: Clarifications = {
  foo: {
    title: 'clarificationTitle',
    text: 'clarificationText',
  },
};

describe('QuestionsScreenComponent', () => {
  let component: QuestionsScreenComponent;
  let fixture: ComponentFixture<QuestionsScreenComponent>;

  let navigationService: NavigationService;
  let screenService: ScreenService;
  let modalService: ModalService;
  let configService: ConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MockModule(UserInfoLoaderModule), BaseModule, ScreenButtonsModule],
      declarations: [
        QuestionsScreenComponent,
        MockComponents(ScreenContainerComponent, PageNameComponent, AnswerButtonComponent),
        MockDirective(ActionDirective),
        MockPipe(ImgPrefixerPipe, (value) => `ImgPrefixerFakePipe:${value}`),
      ],
      providers: [
        WINDOW_PROVIDERS,
        { provide: NavigationService, useClass: NavigationServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ActionService, useClass: ActionServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        { provide: JsonHelperService, useClass: JsonHelperServiceStub },
        MockProvider(ActionToolsService),
        MockProvider(LocationService),
        MockProvider(EventBusService),
        MockProvider(CurrentAnswersService),
        MockProvider(HtmlSelectService),
        MockProvider(SessionService),
      ],
    })
      .overrideComponent(QuestionsScreenComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionsScreenComponent);
    component = fixture.componentInstance;
    navigationService = TestBed.inject(NavigationService);
    screenService = TestBed.inject(ScreenService);
    modalService = TestBed.inject(ModalService);
    configService = TestBed.inject(ConfigService);
    screenService.buttons = [];
    fixture.detectChanges();
  });

  describe('nextStep() method', () => {
    it('should call navigationService.next()', () => {
      const nextStepSpy = jest.spyOn(navigationService, 'next');

      component.nextStep(navigationPayloadSample);

      expect(nextStepSpy).toBeCalledTimes(1);
      expect(nextStepSpy).toBeCalledWith({
        payload: navigationPayloadSample,
      });
    });
  });

  describe('answerChoose() method', () => {
    it('should do nothing if action is disabled', () => {
      const showModalRedirectToSpy = jest.spyOn<any, string>(component, 'showModalRedirectTo');
      const nextStepSpy = jest.spyOn(component, 'nextStep');

      const disabledAction: ComponentActionDto = {
        ...componentActionDtoSample1,
        disabled: true,
      };

      component.answerChoose(disabledAction);

      expect(showModalRedirectToSpy).not.toBeCalled();
      expect(nextStepSpy).not.toBeCalled();
    });

    it('should call showModalRedirectTo() method if action.type is ActionType.modalRedirectTo', () => {
      const showModalRedirectToSpy = jest.spyOn<any, string>(component, 'showModalRedirectTo');
      const nextStepSpy = jest.spyOn(component, 'nextStep');

      const actionWithModalRedirectToActionType: ComponentActionDto = {
        ...componentActionDtoSample1,
        type: ActionType.modalRedirectTo,
      };

      component.answerChoose(actionWithModalRedirectToActionType);

      expect(nextStepSpy).not.toBeCalled();
      expect(showModalRedirectToSpy).toBeCalledTimes(1);
      expect(showModalRedirectToSpy).toBeCalledWith(actionWithModalRedirectToActionType);
    });

    it('should call nextStep() method if action.type is NOT ActionType.modalRedirectTo', () => {
      const showModalRedirectToSpy = jest.spyOn<any, string>(component, 'showModalRedirectTo');
      const nextStepSpy = jest.spyOn(component, 'nextStep');

      const actionWithDownloadActionType: ComponentActionDto = {
        ...componentActionDtoSample1,
        type: ActionType.download,
      };

      screenService.component = componentDtoSample;

      const expectedPayload = {
        [componentDtoSample.id]: {
          visited: true,
          value: actionWithDownloadActionType.value,
        },
      };

      component.answerChoose(actionWithDownloadActionType);

      expect(showModalRedirectToSpy).not.toBeCalled();
      expect(nextStepSpy).toBeCalledTimes(1);
      expect(nextStepSpy).toBeCalledWith(expectedPayload);
    });

    it('should mutate action if action.underConstruction && config.isUnderConstructionModeEnabled || isUnderConstructionModeEnabledViaCookie !== "false"', () => {
      const showModalRedirectToSpy = jest.spyOn<any, string>(component, 'showModalRedirectTo');
      const nextStepSpy = jest.spyOn(component, 'nextStep');

      const actionUnderConstruction: ComponentActionDto = {
        ...componentActionDtoSample1,
        underConstruction: true,
        // this type will change to ActionType.nextStep if config.isUnderConstructionModeEnabled is FALSE
        type: ActionType.modalRedirectTo,
        // this action will change to DTOActionAction.getNextStep if config.isUnderConstructionModeEnabled is FALSE
        action: DTOActionAction.editEmail,
      };

      screenService.component = componentDtoSample;

      configService['_isUnderConstructionModeEnabled'] = true;
      // should NOT mutate action because configService.isUnderConstructionModeEnabled is TRUE
      component.answerChoose(actionUnderConstruction);

      expect(actionUnderConstruction.type).toBe(ActionType.modalRedirectTo);
      expect(actionUnderConstruction.action).toBe(DTOActionAction.editEmail);

      // call showModalRedirectTo() because action is modalRedirectTo
      expect(showModalRedirectToSpy).toBeCalledTimes(1);
      expect(nextStepSpy).not.toBeCalled();
      showModalRedirectToSpy.mockReset();

      configService['_isUnderConstructionModeEnabled'] = false;
      // should mutate action because configService.isUnderConstructionModeEnabled is FALSE
      component.answerChoose(actionUnderConstruction);

      expect(actionUnderConstruction.type).toBe(ActionType.nextStep);
      expect(actionUnderConstruction.action).toBe(DTOActionAction.getNextStep);

      expect(showModalRedirectToSpy).not.toBeCalled();
      // call nextStep() because action is changed to ActionType.nextStep
      expect(nextStepSpy).toBeCalledTimes(1);
      nextStepSpy.mockReset();

      configService['_isUnderConstructionModeEnabled'] = true;
      component.isUnderConstructionModeEnabledViaCookie = false;
      // should mutate action because component.isUnderConstructionModeEnabledViaCookie is FALSE
      component.answerChoose(actionUnderConstruction);

      expect(actionUnderConstruction.type).toBe(ActionType.nextStep);
      expect(actionUnderConstruction.action).toBe(DTOActionAction.getNextStep);

      expect(showModalRedirectToSpy).not.toBeCalled();
      // call nextStep() because action is changed to ActionType.nextStep
      expect(nextStepSpy).toBeCalledTimes(1);
    });
  });

  describe('epgu-cf-ui-screen-container', () => {
    const selector = 'epgu-cf-ui-screen-container';

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

  it('should render epgu-constructor-page-name', () => {
    const selector = 'epgu-cf-ui-screen-container epgu-constructor-page-name';

    const debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl).toBeTruthy();

    expect(debugEl.nativeElement.textContent.trim()).toBe('');

    screenService.header = 'any';
    fixture.detectChanges();

    expect(debugEl.nativeElement.textContent.trim()).toBe('any');
  });

  describe('epgu-constructor-output-html', () => {
    const selector = 'epgu-cf-ui-screen-container epgu-constructor-output-html';

    it('should be rendered if screenService.component.label is NOT EMPTY', () => {
      let debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl).toBeNull();

      screenService.component = {
        ...componentDtoSample,
        attrs: {},
      };
      screenService.componentLabel = '';
      fixture.detectChanges();

      debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl).toBeNull();

      screenService.component = {
        ...componentDtoSample,
        attrs: {},
      };
      screenService.componentLabel = 'any label';
      fixture.detectChanges();

      debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl).toBeTruthy();
    });

    it('label property should be equal to "screenService.component.label | ImgPrefixer"', () => {
      screenService.component = {
        ...componentDtoSample,
        attrs: {},
      };
      screenService.componentLabel = 'any label';
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.componentInstance.html).toBe('ImgPrefixerFakePipe:any label');
    });

    it('clarifications property should be equal to screenService.component?.attrs?.clarifications', () => {
      screenService.component = {
        ...componentDtoSample,
        attrs: {},
      };
      screenService.componentLabel = 'any label';
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.componentInstance.clarifications).toBeUndefined();

      screenService.component = {
        ...componentDtoSample,
        attrs: {
          clarifications: clarificationsSample,
        },
      };
      screenService.componentLabel = 'any label';
      fixture.detectChanges();

      expect(debugEl.componentInstance.clarifications).toBe(clarificationsSample);
    });
  });
});
