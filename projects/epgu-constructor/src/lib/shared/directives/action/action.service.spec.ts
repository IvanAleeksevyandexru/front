import { TestBed } from '@angular/core/testing';
import { ActionService } from './action.service';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { ConfigServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { FormPlayerApiService } from '../../../form-player/services/form-player-api/form-player-api.service';
import { FormPlayerApiServiceStub } from '../../../form-player/services/form-player-api/form-player-api.service.stub';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { NavigationService } from '../../../core/services/navigation/navigation.service';
import { NavigationServiceStub } from '../../../core/services/navigation/navigation.service.stub';
import { NavigationModalService } from '../../../core/services/navigation-modal/navigation-modal.service';
import { UtilsService } from '@epgu/epgu-constructor-ui-kit';
import { UtilsServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { LocalStorageService, LocalStorageServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { SessionStorageService, SessionStorageServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { HtmlRemoverService } from '../../services/html-remover/html-remover.service';
import { ORDER_TO_ORDER_SCENARIO_KEY, QUIZ_SCENARIO_KEY } from '../../constants/form-player';
import { Observable, of } from 'rxjs';
import { CurrentAnswersService } from '../../../screen/current-answers.service';
import { AutocompleteApiService } from '../../../core/services/autocomplete/autocomplete-api.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { EventBusService } from '@epgu/epgu-constructor-ui-kit';
import { ModalService, ModalServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { FormPlayerServiceStub } from '../../../form-player/services/form-player/form-player.service.stub';
import { ScreenTypes } from '@epgu/epgu-constructor-types';
import { configureTestSuite } from 'ng-bullet';
import { FormPlayerService } from '../../../form-player/services/form-player/form-player.service';
import {
  ComponentDto,
  ActionType,
  ComponentActionDto,
  DTOActionAction,
  ActionApiResponse,
} from '@epgu/epgu-constructor-types';
import { HookServiceStub } from '../../../core/services/hook/hook.service.stub';
import { HookService } from '../../../core/services/hook/hook.service';
import { HookTypes } from '../../../core/services/hook/hook.constants';
import { tap } from 'rxjs/operators';
import { EaisdoGroupCostService } from '../../services/eaisdo-group-cost/eaisdo-group-cost.service';
import { JsonHelperService } from '../../../core/services/json-helper/json-helper.service';

const mockComponent: ComponentDto = {
  attrs: {},
  label: '',
  type: '',
  id: '12',
  value: '',
};

const downloadAction: ComponentActionDto = {
  label: '',
  value: '',
  action: DTOActionAction.editPhoneNumber,
  type: ActionType.download,
};

const prevStepModalAction: ComponentActionDto = {
  label: '',
  value: '',
  action: DTOActionAction.editPhoneNumber,
  type: ActionType.prevStepModal,
};

const nextStepModalAction: ComponentActionDto = {
  label: '',
  value: '',
  action: DTOActionAction.editPhoneNumber,
  type: ActionType.nextStepModal,
};

const skipAction: ComponentActionDto = {
  label: '',
  value: '',
  action: DTOActionAction.editPhoneNumber,
  type: ActionType.skipStep,
};

const nextAction: ComponentActionDto = {
  label: '',
  action: DTOActionAction.editPhoneNumber,
  type: ActionType.nextStep,
  value: 'some value',
};

const prevAction: ComponentActionDto = {
  label: '',
  value: '',
  action: DTOActionAction.editPhoneNumber,
  type: ActionType.prevStep,
};

const quizToOrderAction: ComponentActionDto = {
  label: '',
  value: '',
  action: '/to-some-order' as DTOActionAction,
  type: ActionType.quizToOrder,
};

const orderToOrderAction: ComponentActionDto = {
  label: '',
  value: '',
  action: '/to-some-order' as DTOActionAction,
  type: ActionType.orderToOrder,
  multipleAnswers: [
    {
      screenId: 's1',
      componentId: 'w1',
      priority: 2,
      value: 'valueA',
    },
    {
      screenId: 's2',
      componentId: 'q1',
      priority: 1,
      value: 'valueB',
    },
  ],
};

const redirectToLKAction: ComponentActionDto = {
  label: '',
  value: '',
  action: DTOActionAction.editPhoneNumber,
  type: ActionType.redirectToLK,
};

const profileEditAction: ComponentActionDto = {
  label: '',
  value: '',
  action: DTOActionAction.editPhoneNumber,
  type: ActionType.profileEdit,
};

const homeAction: ComponentActionDto = {
  label: '',
  value: '',
  action: DTOActionAction.editPhoneNumber,
  type: ActionType.home,
};

const openDropdownModalAction: ComponentActionDto = {
  label: '',
  value: 'test',
  action: null,
  type: ActionType.dropdownListModal,
};

const openConfirmationModalAction: ComponentActionDto = {
  label: 'test',
  value: 'confirmation',
  action: null,
  type: ActionType.confirmModalStep,
};

const deliriumAction: ComponentActionDto = {
  label: 'delirium',
  value: 'delirium',
  action: DTOActionAction.getNextStep,
  type: ActionType.deliriumNextStep,
  deliriumAction: 'edit',
};

const redirectAction: ComponentActionDto = {
  label: 'redirect',
  value: '#',
  action: DTOActionAction.redirect,
  type: ActionType.redirect,
};

const redirectToPayByUinAction: ComponentActionDto = {
  label: 'Начать',
  value: '',
  type: ActionType.redirectToPayByUin,
  action: DTOActionAction.redirectToPayByUin,
};

const sendActionMock = of({
  errorList: [],
  responseData: { value: 'value', type: 'type' },
}) as Observable<ActionApiResponse<string>>;

describe('ActionService', () => {
  let actionService: ActionService;
  let utilsService: UtilsService;
  let navigationModalService: NavigationModalService;
  let navigationService: NavigationService;
  let screenService: ScreenService;
  let modalPrevStepSpy: jasmine.Spy;
  let modalNextStepSpy: jasmine.Spy;
  let skipStepSpy: jasmine.Spy;
  let localStorageService: LocalStorageService;
  let sessionStorageService: SessionStorageService;
  let formPlayerApiService: FormPlayerApiService;
  let modalService: ModalService;
  let hookService: HookService;
  let currentAnswersService: CurrentAnswersService;
  let htmlRemover: HtmlRemoverService;
  let formPlayerService: FormPlayerService;

  let prevStepSpy: jasmine.Spy;
  let nextStepSpy: jasmine.Spy;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: FormPlayerApiService, useClass: FormPlayerApiServiceStub },
        { provide: FormPlayerService, useClass: FormPlayerServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: NavigationService, useClass: NavigationServiceStub },
        { provide: UtilsService, useClass: UtilsServiceStub },
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
        { provide: SessionStorageService, useClass: SessionStorageServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: HookService, useClass: HookServiceStub },
        HtmlRemoverService,
        ActionService,
        NavigationModalService,
        CurrentAnswersService,
        AutocompleteApiService,
        HttpClient,
        HttpHandler,
        EventBusService,
        EaisdoGroupCostService,
        JsonHelperService,
      ],
    });
  });

  beforeEach(() => {
    screenService = TestBed.inject(ScreenService);
    actionService = TestBed.inject(ActionService);
    formPlayerService = TestBed.inject(FormPlayerService);
    utilsService = TestBed.inject(UtilsService);
    navigationService = TestBed.inject(NavigationService);
    navigationModalService = TestBed.inject(NavigationModalService);
    localStorageService = TestBed.inject(LocalStorageService);
    sessionStorageService = TestBed.inject(SessionStorageService);
    formPlayerApiService = TestBed.inject(FormPlayerApiService);
    modalService = TestBed.inject(ModalService);
    hookService = TestBed.inject(HookService);
    currentAnswersService = TestBed.inject(CurrentAnswersService);
    htmlRemover = TestBed.inject(HtmlRemoverService);

    jest.spyOn(screenService, 'component', 'get').mockReturnValue(mockComponent);
    jest.spyOn(formPlayerApiService, 'sendAction').mockReturnValue(sendActionMock);

    skipStepSpy = spyOn(navigationService, 'skip');
    nextStepSpy = spyOn(navigationService, 'next');
    prevStepSpy = spyOn(navigationService, 'prev');

    modalPrevStepSpy = spyOn(navigationModalService, 'prev');
    modalNextStepSpy = spyOn(navigationModalService, 'next');
  });

  it('should extend ActionService', () => {
    expect(actionService).toBeInstanceOf(ActionService);
  });

  it('should call switchAction download', () => {
    spyOn(utilsService, 'downloadFile').and.callThrough();
    actionService.switchAction(downloadAction, null);
    expect(utilsService.downloadFile).toBeCalledTimes(1);
  });

  it('should call switchAction prev modal', () => {
    modalPrevStepSpy.calls.reset();
    actionService.switchAction(prevStepModalAction, null);
    expect(modalPrevStepSpy).toBeCalledTimes(1);
  });

  it('should call switchAction next modal', () => {
    modalNextStepSpy.calls.reset();
    actionService.switchAction(nextStepModalAction, null);
    expect(modalNextStepSpy).toBeCalledTimes(1);
  });

  it('should call switchAction skip', () => {
    skipStepSpy.calls.reset();
    actionService.switchAction(skipAction, null);
    expect(skipStepSpy).toBeCalledTimes(1);
  });

  it('should call switchAction next', () => {
    nextStepSpy.calls.reset();
    actionService.switchAction(nextAction, null);
    expect(nextStepSpy).toBeCalledTimes(1);
  });

  it('should call switchAction prev', () => {
    prevStepSpy.calls.reset();
    actionService.switchAction(prevAction, null);
    expect(prevStepSpy).toBeCalledTimes(1);
  });

  it('should call switchAction quiz', () => {
    spyOn(navigationService, 'redirectTo').and.callThrough();
    spyOn(screenService, 'getStore').and.returnValue({ applicantAnswers: {}});
    spyOn(localStorageService, 'set').and.callThrough();
    actionService.switchAction(quizToOrderAction, null);

    const applicantAnswers = {
      12: {
        visited: true,
        value: '',
      },
    };

    expect(localStorageService.set).toHaveBeenCalledWith(QUIZ_SCENARIO_KEY, { applicantAnswers });
    expect(navigationService.redirectTo).toHaveBeenCalledWith('/to-some-order');
  });

  it('should call switchAction orderToOrder', () => {
    spyOn(navigationService, 'redirectTo').and.callThrough();
    spyOn(screenService, 'getStore').and.returnValue({ applicantAnswers: {}});
    spyOn(localStorageService, 'set').and.callThrough();
    actionService.switchAction(orderToOrderAction, null);

    const applicantAnswers = {
      q1: {
        value: 'valueB',
        visited: true,
      },
      w1: {
        value: 'valueA',
        visited: true,
      },
    };

    const finishedAndCurrentScreens = ['s2', 's1'];

    expect(localStorageService.set).toHaveBeenCalledWith(ORDER_TO_ORDER_SCENARIO_KEY, {
      applicantAnswers,
      finishedAndCurrentScreens,
    });
    expect(navigationService.redirectTo).toHaveBeenCalledWith('/to-some-order');
  });

  it('should call switchAction redirectToLK', () => {
    spyOn(navigationService, 'redirectToLKByOrgType').and.callThrough();
    actionService.switchAction(redirectToLKAction, null);
    expect(navigationService.redirectToLKByOrgType).toHaveBeenCalled();
  });

  it('should call switchAction profileEdit', () => {
    spyOn(navigationService, 'redirectToProfileEdit').and.callThrough();
    actionService.switchAction(profileEditAction, null);
    expect(navigationService.redirectToProfileEdit).toHaveBeenCalled();
  });

  it('should call switchAction redirectToHome', () => {
    spyOn(navigationService, 'redirectToHome').and.callThrough();
    actionService.switchAction(homeAction, null);
    expect(navigationService.redirectToHome).toHaveBeenCalled();
  });

  it('should call switchAction openDropdownListModal', () => {
    spyOn(modalService, 'openModal').and.callThrough();
    actionService.switchAction(openDropdownModalAction, null);
    expect(modalService.openModal).toHaveBeenCalled();
  });

  it('should call switchAction openConfirmationModal', () => {
    spyOn(screenService, 'getStore').and.returnValue({
      display: {
        confirmations: {
          confirmation: {
            title: 'Some title',
            text: 'Some text',
            submitLabel: 'Send',
          },
        },
      },
    });
    spyOn(modalService, 'openModal').and.callThrough();
    actionService.switchAction(openConfirmationModalAction, null);
    expect(modalService.openModal).toHaveBeenCalled();
  });

  it('should call switchAction handleDeliriumAction', () => {
    spyOn(actionService, 'handleDeliriumAction').and.callThrough();
    actionService.switchAction(deliriumAction, null);
    expect(actionService['handleDeliriumAction']).toHaveBeenCalled();
  });

  it('should call switchAction redirectExternal', () => {
    spyOn(navigationService, 'redirectExternal').and.callThrough();
    actionService.switchAction(redirectAction, null);
    expect(navigationService.redirectExternal).toHaveBeenCalled();
  });

  describe('getComponentStateForNavigate()', () => {
    it('should return current value for custom screen', () => {
      const display = new FormPlayerServiceStub()._store.scenarioDto.display;
      display.type = ScreenTypes.CUSTOM;
      screenService.display = display;
      spyOn<any>(actionService, 'isTimerComponent').and.returnValue(false);
      const expectedValue = { 123: { value: 'some value' }};
      currentAnswersService.state = expectedValue;
      const value = actionService['getComponentStateForNavigate'](nextAction, '123');
      expect(value).toEqual(expectedValue);
    });

    it('should return current value for timer case', () => {
      const display = new FormPlayerServiceStub()._store.scenarioDto.display;
      display.type = ScreenTypes.CUSTOM;
      screenService.display = display;
      spyOn<any>(actionService, 'isTimerComponent').and.returnValue(true);
      const expectedValue = { 123: { visited: true, value: nextAction.value }};
      const value = actionService['getComponentStateForNavigate'](nextAction, '123');
      expect(value).toEqual(expectedValue);
    });

    it('should return current value for unique screen', () => {
      const display = new FormPlayerServiceStub()._store.scenarioDto.display;
      screenService.display = display;
      const expectedValue = { 123: { value: 'some value', visited: true }};
      currentAnswersService.state = 'some value';
      const value = actionService['getComponentStateForNavigate'](nextAction, '123');
      expect(value).toEqual(expectedValue);
    });

    it('should return current value for unique screen with skipAction', () => {
      const display = new FormPlayerServiceStub()._store.scenarioDto.display;
      screenService.display = display;
      const expectedValue = { 123: { value: '', visited: true }};
      currentAnswersService.state = 'some value';
      const value = actionService['getComponentStateForNavigate'](skipAction, '123');
      expect(value).toEqual(expectedValue);
    });
  });

  describe('handleDeliriumAction()', () => {
    it('sould call formPlayerService.navigate()', () => {
      const formPlayerServiceNavigateSpy = spyOn(formPlayerService, 'navigate');
      actionService['handleDeliriumAction'](deliriumAction, 'componentId');
      expect(formPlayerServiceNavigateSpy).toBeCalled();
    });
  });

  describe('redirectToPayByUin()', () => {
    beforeEach(() => {
      screenService.serviceInfo = {
        billNumber: '100',
      };
    });

    it('should call htmlRemover.delete()', () => {
      const spy = spyOn(navigationService, 'redirectTo');
      actionService.switchAction(redirectToPayByUinAction, '');
      expect(spy).toHaveBeenCalledWith('oplataUrl/pay/uin/100');
    });
  });

  describe('redirectToEdit()', () => {
    const action = (action) => ({ ...profileEditAction, action });

    it('editChildData', () => {
      jest.spyOn(navigationService, 'redirectTo');
      sessionStorageService.setRaw('childId', '1');
      actionService.switchAction(action(DTOActionAction.editChildData), null);
      expect(navigationService.redirectTo).toHaveBeenCalled();
      expect(navigationService.redirectTo).toHaveBeenCalledWith('/profile/family/child/1');
    });

    it('editLegalPhone or editLegalEmail', () => {
      jest.spyOn(navigationService, 'redirectTo');
      actionService.switchAction(action(DTOActionAction.editLegalPhone), null);
      expect(navigationService.redirectTo).toHaveBeenCalled();
      expect(navigationService.redirectTo).toHaveBeenCalledWith('/notification-setup');

      actionService.switchAction(action(DTOActionAction.editLegalEmail), null);
      expect(navigationService.redirectTo).toHaveBeenCalled();
      expect(navigationService.redirectTo).toHaveBeenCalledWith('/notification-setup');
    });

    it('by default', () => {
      jest.spyOn(navigationService, 'redirectToProfileEdit');
      actionService.switchAction(action(null), null);
      expect(navigationService.redirectToProfileEdit).toHaveBeenCalled();
    });
  });

  describe('navigate with hooks', () => {
    it('should do navigate after hooks', () => {
      const restCallObserver = of({ someComponent: { value: 'some data', visited: true }}).pipe(
        tap((data) => {
          screenService.logicAnswers = data;
        }),
      );
      const hasHooksSpy = jest.spyOn(hookService, 'hasHooks').mockReturnValue(true);
      const getHooksSpy = jest.spyOn(hookService, 'getHooks').mockReturnValue([restCallObserver]);
      const action = { ...nextAction };

      actionService.switchAction(action, null);
      expect(nextStepSpy).toHaveBeenCalledWith({
        options: {
          params: {},
          url: 'service/actions/editPhoneNumber',
        },
        payload: {
          12: {
            value: 'some value',
            visited: true,
          },
          someComponent: {
            value: 'some data',
            visited: true,
          },
        },
      });
      expect(hasHooksSpy).toHaveBeenCalledWith(HookTypes.ON_BEFORE_SUBMIT);
      expect(getHooksSpy).toHaveBeenCalledWith(HookTypes.ON_BEFORE_SUBMIT);
    });
  });

  describe('prepareActionMultipleAnswers()', () => {
    it('should return parsed action.mulipleAnswers, if they passed as JSON-string', () => {
      const action = ({
        type: ActionType.orderToOrder,
        action: DTOActionAction.getNextStep,
        multipleAnswers: '[{"test": "test"}]',
      } as unknown) as ComponentActionDto;
      const result = actionService['prepareActionMultipleAnswers'](action);
      expect(typeof result.multipleAnswers === 'object').toBe(true);
    });
    it('should return action.mulipleAnswers as is, if they passed non JSON-string', () => {
      const action = ({
        type: ActionType.orderToOrder,
        action: DTOActionAction.getNextStep,
        multipleAnswers: [{ test: 'test' }],
      } as unknown) as ComponentActionDto;
      const result = actionService['prepareActionMultipleAnswers'](action);
      expect(typeof result.multipleAnswers === 'object').toBe(true);
    });
  });
});
