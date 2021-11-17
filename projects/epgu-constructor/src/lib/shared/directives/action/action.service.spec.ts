import { TestBed } from '@angular/core/testing';
import { ActionService } from './action.service';
import {
  ConfigService,
  DeviceDetectorService,
  DeviceDetectorServiceStub,
  LocationService,
  LocationServiceStub,
  ModalService,
  ModalServiceStub,
} from '@epgu/epgu-constructor-ui-kit';
import { ConfigServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { FormPlayerApiService } from '../../../form-player/services/form-player-api/form-player-api.service';
import { FormPlayerApiServiceStub } from '../../../form-player/services/form-player-api/form-player-api.service.stub';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { NavigationService } from '../../../core/services/navigation/navigation.service';
import { NavigationServiceStub } from '../../../core/services/navigation/navigation.service.stub';
import { NavigationModalService } from '../../../core/services/navigation-modal/navigation-modal.service';
import { DownloadService } from '@epgu/epgu-constructor-ui-kit';
import { DownloadServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { LocalStorageService, LocalStorageServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { SessionStorageService, SessionStorageServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { HtmlRemoverService } from '../../services/html-remover/html-remover.service';
import { ORDER_TO_ORDER_SCENARIO_KEY, QUIZ_SCENARIO_KEY } from '../../constants/form-player';
import { CurrentAnswersService } from '../../../screen/current-answers.service';
import { AutocompleteApiService } from '../../../core/services/autocomplete/autocomplete-api.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { EventBusService } from '@epgu/epgu-constructor-ui-kit';
import { FormPlayerServiceStub } from '../../../form-player/services/form-player/form-player.service.stub';
import { ScreenTypes } from '@epgu/epgu-constructor-types';
import { FormPlayerService } from '../../../form-player/services/form-player/form-player.service';
import { ActionType, ComponentActionDto, DTOActionAction } from '@epgu/epgu-constructor-types';
import { HookServiceStub } from '../../../core/services/hook/hook.service.stub';
import { HookService } from '../../../core/services/hook/hook.service';
import { EaisdoGroupCostService } from '../../services/eaisdo-group-cost/eaisdo-group-cost.service';
import { JsonHelperService } from '../../../core/services/json-helper/json-helper.service';
import {
  mockComponent,
  sendActionMock,
  downloadAction,
  prevStepModalAction,
  nextStepModalAction,
  skipAction,
  restartOrderAction,
  nextAction,
  prevAction,
  quizToOrderAction,
  orderToOrderAction,
  redirectToLKAction,
  profileEditAction,
  homeAction,
  reloadAction,
  openDropdownModalAction,
  openConfirmationModalAction,
  redirectAction,
  redirectToPayByUinAction,
  deliriumAction,
  saveCacheAction,
} from './action.mock';
import { ActionToolsService } from './action-tools.service';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HookTypes } from '../../../core/services/hook/hook.constants';

describe('ActionService', () => {
  let actionService: ActionService;
  let actionToolsService: ActionToolsService;
  let downloadService: DownloadService;
  let navigationModalService: NavigationModalService;
  let navigationService: NavigationService;
  let screenService: ScreenService;
  let localStorageService: LocalStorageService;
  let sessionStorageService: SessionStorageService;
  let formPlayerApiService: FormPlayerApiService;
  let currentAnswersService: CurrentAnswersService;
  let locationService: LocationService;
  let hookService: HookService;

  let modalPrevStepSpy;
  let modalNextStepSpy;
  let skipStepSpy;
  let restartOrderSpy;
  let prevStepSpy;
  let nextStepSpy;
  let saveCacheSpy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: DownloadService, useClass: DownloadServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        { provide: FormPlayerApiService, useClass: FormPlayerApiServiceStub },
        { provide: FormPlayerService, useClass: FormPlayerServiceStub },
        { provide: HookService, useClass: HookServiceStub },
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
        { provide: LocationService, useClass: LocationServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: NavigationService, useClass: NavigationServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: SessionStorageService, useClass: SessionStorageServiceStub },
        ActionService,
        ActionToolsService,
        AutocompleteApiService,
        CurrentAnswersService,
        EaisdoGroupCostService,
        EventBusService,
        HtmlRemoverService,
        HttpClient,
        HttpHandler,
        JsonHelperService,
        NavigationModalService,
      ],
    });
  });

  beforeEach(() => {
    screenService = TestBed.inject(ScreenService);
    actionService = TestBed.inject(ActionService);
    actionToolsService = TestBed.inject(ActionToolsService);
    hookService = TestBed.inject(HookService);
    downloadService = TestBed.inject(DownloadService);
    navigationService = TestBed.inject(NavigationService);
    locationService = TestBed.inject(LocationService);
    navigationModalService = TestBed.inject(NavigationModalService);
    localStorageService = TestBed.inject(LocalStorageService);
    sessionStorageService = TestBed.inject(SessionStorageService);
    formPlayerApiService = TestBed.inject(FormPlayerApiService);
    currentAnswersService = TestBed.inject(CurrentAnswersService);

    jest.spyOn(screenService, 'component', 'get').mockReturnValue(mockComponent);
    jest.spyOn(formPlayerApiService, 'sendAction').mockReturnValue(sendActionMock);

    skipStepSpy = jest.spyOn(navigationService, 'skip');
    restartOrderSpy = jest.spyOn(navigationService, 'restartOrder');
    nextStepSpy = jest.spyOn(navigationService, 'next');
    prevStepSpy = jest.spyOn(navigationService, 'prev');
    saveCacheSpy = jest.spyOn(navigationService, 'saveCache');

    modalPrevStepSpy = jest.spyOn(navigationModalService, 'prev');
    modalNextStepSpy = jest.spyOn(navigationModalService, 'next');

    screenService.display = new FormPlayerServiceStub()._store.scenarioDto.display;
  });

  it('should extend ActionService', () => {
    expect(actionService).toBeInstanceOf(ActionService);
  });

  it('should call switchAction download', () => {
    const spy = jest.spyOn(downloadService, 'downloadFile');
    actionService.switchAction(downloadAction, null);
    expect(spy).toBeCalledTimes(1);
  });

  it('should call switchAction prev modal', () => {
    actionService.switchAction(prevStepModalAction, null);
    expect(modalPrevStepSpy).toBeCalledTimes(1);
  });

  it('should call switchAction next modal', () => {
    actionService.switchAction(nextStepModalAction, null);
    expect(modalNextStepSpy).toBeCalledTimes(1);
  });

  it('should call switchAction skip', () => {
    actionService.switchAction(skipAction, null);
    expect(skipStepSpy).toBeCalledTimes(1);
  });

  it('should call switchAction restartOrder', () => {
    actionService.switchAction(restartOrderAction, null);
    expect(restartOrderSpy).toBeCalledTimes(1);
  });

  it('should call switchAction next', () => {
    actionService.switchAction(nextAction, null);
    expect(nextStepSpy).toBeCalledTimes(1);
  });

  it('should call switchAction prev', () => {
    actionService.switchAction(prevAction, null);
    expect(prevStepSpy).toBeCalledTimes(1);
  });

  it('should call switchAction saveCache', () => {
    actionService.switchAction(saveCacheAction, null);
    expect(saveCacheSpy).toBeCalledTimes(1);
  });

  it('should call switchAction quiz', () => {
    const spySet = jest.spyOn(localStorageService, 'set');
    const spyRedirectTo = jest.spyOn(navigationService, 'redirectTo');
    jest.spyOn(screenService, 'getStore').mockReturnValue({ applicantAnswers: {}});
    actionService.switchAction(quizToOrderAction, null);

    const applicantAnswers = {
      12: {
        visited: true,
        value: '',
      },
    };

    expect(spySet).toHaveBeenCalledWith(QUIZ_SCENARIO_KEY, { applicantAnswers });
    expect(spyRedirectTo).toHaveBeenCalledWith('/to-some-order');
  });

  it('should call switchAction orderToOrder', () => {
    const spySet = jest.spyOn(localStorageService, 'set');
    const spyRedirectTo = jest.spyOn(navigationService, 'redirectTo');
    jest.spyOn(screenService, 'getStore').mockReturnValue({ applicantAnswers: {}});
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

    expect(spySet).toHaveBeenCalledWith(ORDER_TO_ORDER_SCENARIO_KEY, {
      applicantAnswers,
      finishedAndCurrentScreens,
    });
    expect(spyRedirectTo).toHaveBeenCalledWith('/to-some-order');
  });

  it('should call switchAction redirectToLK', () => {
    const spy = jest.spyOn(navigationService, 'redirectToLKByOrgType');
    actionService.switchAction(redirectToLKAction, null);
    expect(spy).toHaveBeenCalled();
  });

  it('should call switchAction profileEdit', () => {
    const spy = jest.spyOn(navigationService, 'redirectToProfileEdit');
    actionService.switchAction(profileEditAction, null);
    expect(spy).toHaveBeenCalled();
  });

  it('should call switchAction redirectToHome', () => {
    const spy = jest.spyOn(navigationService, 'redirectToHome');
    actionService.switchAction(homeAction, null);
    expect(spy).toHaveBeenCalled();
  });

  it('should call switchAction reload', () => {
    const spy = jest.spyOn(locationService, 'reload');
    actionService.switchAction(reloadAction, null);
    expect(spy).toHaveBeenCalled();
  });

  it('should call switchAction openDropdownListModal', () => {
    const spy = jest.spyOn(actionToolsService, 'openDropdownListModal');
    actionService.switchAction(openDropdownModalAction, null);
    expect(spy).toHaveBeenCalled();
  });

  it('should call switchAction openConfirmationModal', () => {
    jest.spyOn(screenService, 'getStore').mockReturnValue({
      display: {
        confirmations: {
          // @ts-ignore
          confirmation: {
            title: 'Some title',
            text: 'Some text',
          },
        },
      },
    });
    const spy = jest.spyOn(actionToolsService, 'openConfirmationModal');
    actionService.switchAction(openConfirmationModalAction, null);
    expect(spy).toHaveBeenCalled();
  });

  it('should call switchAction handleDeliriumAction', () => {
    const spy = jest.spyOn(actionToolsService, 'handleDeliriumAction');
    actionService.switchAction(deliriumAction, null);
    expect(spy).toHaveBeenCalled();
  });

  it('should call switchAction redirectExternal', () => {
    const spy = jest.spyOn(navigationService, 'redirectExternal');
    actionService.switchAction(redirectAction, null);
    expect(spy).toHaveBeenCalled();
  });

  describe('getComponentStateForNavigate()', () => {
    it('should return current value for custom screen', () => {
      const display = new FormPlayerServiceStub()._store.scenarioDto.display;
      display.type = ScreenTypes.CUSTOM;
      screenService.display = display;
      jest.spyOn<any, string>(actionToolsService, 'isTimerComponent').mockReturnValue(false);
      const expectedValue = { 123: { value: 'some value', visited: true }};
      currentAnswersService.state = expectedValue;
      const value = actionToolsService['getComponentStateForNavigate'](nextAction, '123');
      expect(value).toEqual(expectedValue);
    });

    it('should return current value for timer case', () => {
      const display = new FormPlayerServiceStub()._store.scenarioDto.display;
      display.type = ScreenTypes.CUSTOM;
      screenService.display = display;
      jest.spyOn<any, string>(actionToolsService, 'isTimerComponent').mockReturnValue(true);
      const expectedValue = { 123: { visited: true, value: nextAction.value }};
      const value = actionToolsService['getComponentStateForNavigate'](nextAction, '123');
      expect(value).toEqual(expectedValue);
    });

    it('should return current value for unique screen', () => {
      const display = new FormPlayerServiceStub()._store.scenarioDto.display;
      screenService.display = display;
      const expectedValue = { 123: { value: 'some value', visited: true }};
      currentAnswersService.state = 'some value';
      const value = actionToolsService['getComponentStateForNavigate'](nextAction, '123');
      expect(value).toEqual(expectedValue);
    });

    it('should return current value for unique screen with skipAction', () => {
      const display = new FormPlayerServiceStub()._store.scenarioDto.display;
      screenService.display = display;
      const expectedValue = { 123: { value: '', visited: true }};
      currentAnswersService.state = 'some value';
      const value = actionToolsService['getComponentStateForNavigate'](skipAction, '123');
      expect(value).toEqual(expectedValue);
    });
  });

  describe('redirectToPayByUin()', () => {
    beforeEach(() => {
      screenService.serviceInfo = {
        billNumber: '100',
      };
    });

    it('should call navigationService.redirectTo()', () => {
      const spy = jest.spyOn(navigationService, 'redirectTo');
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
      expect(navigationService.redirectTo).toHaveBeenCalledWith('/profile/family/child/1/docs');
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

    it('editPersonalData', () => {
      jest.spyOn(navigationService, 'redirectTo');
      actionService.switchAction(action(DTOActionAction.editPersonalData), null);
      expect(navigationService.redirectTo).toHaveBeenCalled();
      expect(navigationService.redirectTo).toHaveBeenCalledWith('/profile/personal');
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
