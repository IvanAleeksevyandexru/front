import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { EpguLibModule } from 'epgu-lib';
import { MockComponents, MockDirective, MockModule, MockPipe } from 'ng-mocks';
import { OutputHtmlComponent } from '../../shared/components/output-html/output-html.component';
import { ConfigService } from '../../core/services/config/config.service';
import { ConfigServiceStub } from '../../core/services/config/config.service.stub';
import { ImgPrefixerPipe } from '../../shared/pipes/img-prefixer/img-prefixer.pipe';
import { NavigationService } from '../../core/services/navigation/navigation.service';
import { NavigationServiceStub } from '../../core/services/navigation/navigation.service.stub';
import { NavigationPayload } from '../../form-player/form-player.types';
import {
  ActionType,
  ClarificationsDto,
  ComponentActionDto,
  ComponentDto,
  DTOActionAction,
} from '../../form-player/services/form-player-api/form-player-api.types';
import { ModalService } from '../../modal/modal.service';
import { ModalServiceStub } from '../../modal/modal.service.stub';
import { AnswerButtonComponent } from '../../shared/components/answer-button/answer-button.component';
import { PageNameComponent } from '../../shared/components/base-components/page-name/page-name.component';
import { ScreenContainerComponent } from '../../shared/components/screen-container/screen-container.component';
import { ActionDirective } from '../../shared/directives/action/action.directive';
import { ScreenService } from '../screen.service';
import { ScreenServiceStub } from '../screen.service.stub';
import { QuestionsScreenComponent } from './questions-screen.component';
import { LocationService } from '../../core/services/location/location.service';
import { WINDOW_PROVIDERS } from '../../core/providers/window.provider';

const componentDtoSample: ComponentDto = {
  attrs: {},
  id: 'id1',
  type: 'type1',
};

const componentActionDtoSample1: ComponentActionDto = {
  label: 'actionLabel1',
  value: 'actionValue1',
  action: DTOActionAction.editPhoneNumber,
};

const componentActionDtoSample2: ComponentActionDto = {
  label: 'actionLabel2',
  value: 'actionValue2',
  action: DTOActionAction.editPhoneNumber,
};

const navigationPayloadSample: NavigationPayload = {
  foo: {
    visited: true,
    value: 'bar',
  },
};

const clarificationsSample: ClarificationsDto = {
  foo: {
    title: 'clarificationTitle',
    text: 'clarificationText',
  },
};

describe('QuestionsScreenComponent', () => {
  let component: QuestionsScreenComponent;
  let fixture: ComponentFixture<QuestionsScreenComponent>;

  let navigationService: NavigationServiceStub;
  let screenService: ScreenServiceStub;
  let modalService: ModalServiceStub;
  let configService: ConfigServiceStub;

  const initComponent = () => {
    fixture = TestBed.createComponent(QuestionsScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MockModule(EpguLibModule)],
      declarations: [
        QuestionsScreenComponent,
        MockComponents(
          ScreenContainerComponent,
          PageNameComponent,
          OutputHtmlComponent,
          AnswerButtonComponent,
        ),
        MockDirective(ActionDirective),
        MockPipe(ImgPrefixerPipe, (value) => `ImgPrefixerFakePipe:${value}`),
      ],
      providers: [
        LocationService,
        WINDOW_PROVIDERS,
        { provide: NavigationService, useClass: NavigationServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    initComponent();

    navigationService = (TestBed.inject(NavigationService) as unknown) as NavigationServiceStub;
    screenService = (TestBed.inject(ScreenService) as unknown) as ScreenServiceStub;
    modalService = (TestBed.inject(ScreenService) as unknown) as ModalServiceStub;
    configService = (TestBed.inject(ConfigService) as unknown) as ConfigServiceStub;
  });

  describe('rejectAction property', () => {
    it('should be updated on screenService.component$ change', () => {
      expect(component.rejectAction).toBeUndefined();

      // the second and the third action with property action === DTOActionAction.reject
      const componentDtoSample: ComponentDto = {
        attrs: {
          actions: [
            componentActionDtoSample1,
            {
              ...componentActionDtoSample1,
              action: DTOActionAction.reject,
            },
            {
              ...componentActionDtoSample1,
              action: DTOActionAction.reject,
            },
          ],
        },
        id: 'id1',
        type: 'type1',
      };
      screenService.component = componentDtoSample;
      fixture.detectChanges();

      expect(component.rejectAction).toBe(componentDtoSample.attrs.actions[1]); // first rejected action
    });
  });

  describe('submitLabel property', () => {
    it('should be updated on screenService.submitLabel$ change', () => {
      expect(component.submitLabel).toBeNull();

      screenService.submitLabel = 'foo';
      fixture.detectChanges();

      expect(component.submitLabel).toBe('foo');
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

  describe('answerChoose() method', () => {
    it('should do nothing if action is disabled', () => {
      const showModalRedirectToSpy = spyOn<any>(component, 'showModalRedirectTo');
      const nextStepSpy = spyOn(component, 'nextStep');

      const disabledAction: ComponentActionDto = {
        ...componentActionDtoSample1,
        disabled: true,
      };

      component.answerChoose(disabledAction);

      expect(showModalRedirectToSpy).not.toBeCalled();
      expect(nextStepSpy).not.toBeCalled();
    });

    it('should call showModalRedirectTo() method if action.type is ActionType.modalRedirectTo', () => {
      const showModalRedirectToSpy = spyOn<any>(component, 'showModalRedirectTo');
      const nextStepSpy = spyOn(component, 'nextStep');

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
      const showModalRedirectToSpy = spyOn<any>(component, 'showModalRedirectTo');
      const nextStepSpy = spyOn(component, 'nextStep');

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

    it('should mutate action if action.underConstruction && config.disableUnderConstructionMode', () => {
      const showModalRedirectToSpy = spyOn<any>(component, 'showModalRedirectTo');
      const nextStepSpy = spyOn(component, 'nextStep');

      const actionUnderConstruction: ComponentActionDto = {
        ...componentActionDtoSample1,
        underConstruction: true,
        // this type will change to ActionType.nextStep if config.disableUnderConstructionMode is TRUE
        type: ActionType.modalRedirectTo,
        // this action will change to DTOActionAction.getNextStep if config.disableUnderConstructionMode is TRUE
        action: DTOActionAction.editEmail,
      };

      screenService.component = componentDtoSample;

      configService._disableUnderConstructionMode = false;
      // should NOT mutate action because configService.disableUnderConstructionMode is FALSE
      component.answerChoose(actionUnderConstruction);

      expect(actionUnderConstruction.type).toBe(ActionType.modalRedirectTo);
      expect(actionUnderConstruction.action).toBe(DTOActionAction.editEmail);

      // call showModalRedirectTo() because action is modalRedirectTo
      expect(showModalRedirectToSpy).toBeCalledTimes(1);
      expect(nextStepSpy).not.toBeCalled();
      showModalRedirectToSpy.calls.reset();

      configService._disableUnderConstructionMode = true;
      // should mutate action because configService.disableUnderConstructionMode is TRUE
      component.answerChoose(actionUnderConstruction);

      expect(actionUnderConstruction.type).toBe(ActionType.nextStep);
      expect(actionUnderConstruction.action).toBe(DTOActionAction.getNextStep);

      expect(showModalRedirectToSpy).not.toBeCalled();
      // call nextStep() because action is changed to ActionType.nextStep
      expect(nextStepSpy).toBeCalledTimes(1);
    });
  });

  describe('showAnswerAsLongBtn() method', () => {
    it('should return TRUE if action is NOT hidden and NOT rejected, otherwise FALSE', () => {
      expect(
        component.showAnswerAsLongBtn({
          ...componentActionDtoSample1,
          hidden: true,
          action: DTOActionAction.reject,
        }),
      ).toBeFalsy();

      expect(
        component.showAnswerAsLongBtn({
          ...componentActionDtoSample1,
          hidden: false,
          action: DTOActionAction.reject,
        }),
      ).toBeFalsy();

      expect(
        component.showAnswerAsLongBtn({
          ...componentActionDtoSample1,
          hidden: false,
          action: DTOActionAction.editEmail,
        }),
      ).toBeTruthy();
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

  it('should render epgu-constructor-page-name', () => {
    const selector = 'epgu-constructor-screen-container epgu-constructor-page-name';

    const debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl).toBeTruthy();

    expect(debugEl.nativeElement.textContent.trim()).toBe('');

    screenService.header = 'any';
    fixture.detectChanges();

    expect(debugEl.nativeElement.textContent.trim()).toBe('any');
  });

  describe('epgu-constructor-output-html', () => {
    const selector = 'epgu-constructor-screen-container epgu-constructor-output-html';

    it('should be rendered if screenService.component.label is NOT EMPTY', () => {
      let debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl).toBeNull();

      screenService.component = {
        ...componentDtoSample,
        attrs: {},
        label: '',
      };
      fixture.detectChanges();

      debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl).toBeNull();

      screenService.component = {
        ...componentDtoSample,
        attrs: {},
        label: 'any label',
      };
      fixture.detectChanges();

      debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl).toBeTruthy();
    });

    it('label property should be equal to "screenService.component.label | ImgPrefixer"', () => {
      screenService.component = {
        ...componentDtoSample,
        attrs: {},
        label: 'any label',
      };
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.componentInstance.html).toBe('ImgPrefixerFakePipe:any label');
    });

    it('clarifications property should be equal to screenService.component?.attrs?.clarifications', () => {
      screenService.component = {
        ...componentDtoSample,
        attrs: {},
        label: 'any label',
      };
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.componentInstance.clarifications).toBeUndefined();

      screenService.component = {
        ...componentDtoSample,
        attrs: {
          clarifications: clarificationsSample,
        },
        label: 'any label',
      };
      fixture.detectChanges();

      expect(debugEl.componentInstance.clarifications).toBe(clarificationsSample);
    });
  });

  it('should render epgu-constructor-answer-button if showAnswerAsLongBtn() returns TRUE', () => {
    const selector = 'epgu-constructor-screen-container epgu-constructor-answer-button';

    const showAnswerAsLongBtnSpy = spyOn<any>(component, 'showAnswerAsLongBtn').and.returnValue(
      true,
    );

    let debugElements = fixture.debugElement.queryAll(By.css(selector));
    expect(debugElements.length).toBe(0);

    screenService.component = {
      ...componentDtoSample,
      attrs: {
        actions: [componentActionDtoSample1, componentActionDtoSample2],
      },
    };
    fixture.detectChanges();

    debugElements = fixture.debugElement.queryAll(By.css(selector));
    expect(debugElements.length).toBe(2);
    expect(debugElements[0].componentInstance.data).toBe(componentActionDtoSample1);
    expect(debugElements[1].componentInstance.data).toBe(componentActionDtoSample2);

    // allow all actions except componentActionDtoSample1
    showAnswerAsLongBtnSpy.and.callFake((action: ComponentActionDto) => {
      if (action.label === componentActionDtoSample1.label) {
        return false;
      }
      return true;
    });
    fixture.detectChanges();

    debugElements = fixture.debugElement.queryAll(By.css(selector));
    expect(debugElements.length).toBe(1);
    expect(debugElements[0].componentInstance.data).toBe(componentActionDtoSample2);
  });

  it('should call answerChoose() on epgu-constructor-answer-button click() event', () => {
    const selector = 'epgu-constructor-screen-container epgu-constructor-answer-button';

    spyOn<any>(component, 'showAnswerAsLongBtn').and.returnValue(true);

    screenService.component = {
      ...componentDtoSample,
      attrs: {
        actions: [componentActionDtoSample1, componentActionDtoSample2],
      },
    };
    fixture.detectChanges();

    const debugElements = fixture.debugElement.queryAll(By.css(selector));

    const answerChooseSpy = spyOn(component, 'answerChoose');

    debugElements[0].triggerEventHandler('click', 'any');

    expect(answerChooseSpy).toBeCalledTimes(1);
    expect(answerChooseSpy).toBeCalledWith(componentActionDtoSample1);
    answerChooseSpy.calls.reset();

    debugElements[1].triggerEventHandler('click', 'any');

    expect(answerChooseSpy).toBeCalledTimes(1);
    expect(answerChooseSpy).toBeCalledWith(componentActionDtoSample2);
  });

  it('should render lib-button[epgu-constructor-action] if rejectAction is NOT empty', () => {
    const selector = 'epgu-constructor-screen-container lib-button[epgu-constructor-action]';

    let debugEl = fixture.debugElement.query(By.css(selector));
    expect(debugEl).toBeNull();

    component.rejectAction = componentActionDtoSample1;
    fixture.detectChanges();

    debugEl = fixture.debugElement.query(By.css(selector));
    expect(debugEl).toBeTruthy();

    expect(debugEl.injector.get(ActionDirective).action).toBe(componentActionDtoSample1);
    expect(debugEl.nativeElement.textContent.trim()).toBe(componentActionDtoSample1.label);
  });

  describe('lib-button[data-testid="submit-btn"]', () => {
    const selector = 'epgu-constructor-screen-container lib-button[data-testid="submit-btn"]';

    it('should be rendered if rejectAction is NOT empty and submitLabel is NOT empty', () => {
      let debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl).toBeNull();

      component.rejectAction = componentActionDtoSample1;
      fixture.detectChanges();

      debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl).toBeNull();

      component.submitLabel = 'submit label';
      fixture.detectChanges();

      debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl).toBeTruthy();

      expect(debugEl.componentInstance.showLoader).toBeFalsy();
    });

    it('showLoader property should be equal screenService.isLoading', () => {
      component.rejectAction = componentActionDtoSample1;
      component.submitLabel = 'submit label';
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.componentInstance.showLoader).toBeFalsy();

      screenService.isLoadingSubject$.next(true);
      fixture.detectChanges();

      expect(debugEl.componentInstance.showLoader).toBeTruthy();
    });

    it('textContent should be equal to submitLabel', () => {
      component.rejectAction = componentActionDtoSample1;
      component.submitLabel = 'submit label';
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.nativeElement.textContent.trim()).toBe('submit label');

      component.submitLabel = 'submit label #2';
      fixture.detectChanges();

      expect(debugEl.nativeElement.textContent.trim()).toBe('submit label #2');
    });

    it('should call onSubmitClick() on lib-button[data-testid="submit-btn"] click() event', () => {
      component.rejectAction = componentActionDtoSample1;
      component.submitLabel = 'submit label';
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));

      const onSubmitClickSpy = spyOn(component, 'onSubmitClick');

      debugEl.triggerEventHandler('click', 'any');

      expect(onSubmitClickSpy).toBeCalledTimes(1);
      expect(onSubmitClickSpy).toBeCalledWith({
        value: 'submit label',
      });
    });
  });
});
