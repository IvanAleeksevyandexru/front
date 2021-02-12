import { TestBed } from '@angular/core/testing';
import { ActionService } from './action.service';
import { ConfigService } from '../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../core/services/config/config.service.stub';
import { FormPlayerApiService } from '../../../form-player/services/form-player-api/form-player-api.service';
import { FormPlayerApiServiceStub } from '../../../form-player/services/form-player-api/form-player-api.service.stub';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { NavigationService } from '../../../core/services/navigation/navigation.service';
import { NavigationServiceStub } from '../../../core/services/navigation/navigation.service.stub';
import { NavigationModalService } from '../../../core/services/navigation-modal/navigation-modal.service';
import { UtilsService } from '../../../core/services/utils/utils.service';
import { UtilsServiceStub } from '../../../core/services/utils/utils.service.stub';
import { LocalStorageService } from '../../../core/services/local-storage/local-storage.service';
import { LocalStorageServiceStub } from '../../../core/services/local-storage/local-storage.service.stub';
import { HtmlRemoverService } from '../../services/html-remover/html-remover.service';
import {
  ActionApiResponse,
  ActionType,
  ComponentActionDto,
  ComponentDto,
  DTOActionAction
} from '../../../form-player/services/form-player-api/form-player-api.types';
import { QUIZ_SCENARIO_KEY } from '../../constants/form-player';
import { Observable, of } from 'rxjs';
import { CurrentAnswersService } from '../../../screen/current-answers.service';
import { AutocompleteApiService } from '../../../core/services/autocomplete/autocomplete-api.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { EventBusService } from '../../../core/services/event-bus/event-bus.service';

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
  value: '',
  action: DTOActionAction.editPhoneNumber,
  type: ActionType.nextStep,
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
  let formPlayerApiService: FormPlayerApiService;

  let prevStepSpy: jasmine.Spy;
  let nextStepSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: FormPlayerApiService, useClass: FormPlayerApiServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: NavigationService, useClass: NavigationServiceStub },
        { provide: UtilsService, useClass: UtilsServiceStub },
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
        HtmlRemoverService,
        ActionService,
        NavigationModalService,
        CurrentAnswersService,
        AutocompleteApiService,
        HttpClient,
        HttpHandler,
        EventBusService,
      ],
    });

    screenService = TestBed.inject(ScreenService);
    actionService = TestBed.inject(ActionService);
    utilsService = TestBed.inject(UtilsService);
    navigationService = TestBed.inject(NavigationService);
    navigationModalService = TestBed.inject(NavigationModalService);
    localStorageService = TestBed.inject(LocalStorageService);
    formPlayerApiService = TestBed.inject(FormPlayerApiService);

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
        value: ''
      }
    };

    expect(localStorageService.set).toHaveBeenCalledWith(QUIZ_SCENARIO_KEY, { applicantAnswers });
    expect(navigationService.redirectTo).toHaveBeenCalledWith('/to-some-order');
  });

  it('should call switchAction redirectToLK', () => {
    spyOn(navigationService, 'redirectToLK').and.callThrough();
    actionService.switchAction(redirectToLKAction, null);
    expect(navigationService.redirectToLK).toHaveBeenCalled();
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
});
