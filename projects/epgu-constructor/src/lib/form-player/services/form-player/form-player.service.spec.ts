import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { of, Subject, throwError } from 'rxjs';
import { WINDOW_PROVIDERS, WINDOW } from '@epgu/epgu-constructor-ui-kit';
import { LoggerService } from '@epgu/epgu-constructor-ui-kit';
import { LoggerServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { CurrentAnswersService } from '../../../screen/current-answers.service';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { CachedAnswersService } from '../../../shared/services/cached-answers/cached-answers.service';
import { HtmlRemoverService } from '../../../shared/services/html-remover/html-remover.service';
import { FormPlayerNavigation, Navigation } from '../../form-player.types';
import { FormPlayerApiService } from '../form-player-api/form-player-api.service';
import { FormPlayerApiServiceStub } from '../form-player-api/form-player-api.service.stub';
import { InitDataService } from '../../../core/services/init-data/init-data.service';
import { FormPlayerService } from './form-player.service';
import { FormPlayerServiceStub } from './form-player.service.stub';
import { LocalStorageService, LocalStorageServiceStub } from '@epgu/epgu-constructor-ui-kit';
import {
  FormPlayerApiResponse,
  FormPlayerApiSuccessResponse,
  ScreenTypes,
} from '@epgu/epgu-constructor-types';
import { FormPlayerApiErrorStatuses } from '@epgu/epgu-constructor-types';

declare global {
  namespace NodeJS {
    interface Global {
      window: Window;
    }
  }
}

const response = new FormPlayerServiceStub()._store;

describe('FormPlayerService', () => {
  let service: FormPlayerService;
  let screenService: ScreenService;
  let formPlayerApiService: FormPlayerApiService;
  let logger: LoggerService;
  let location: Location;
  let orderId: number;
  let navigation: Navigation;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FormPlayerService,
        InitDataService,
        CachedAnswersService,
        CurrentAnswersService,
        HtmlRemoverService,
        Location,
        WINDOW_PROVIDERS,
        { provide: FormPlayerApiService, useClass: FormPlayerApiServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: LoggerService, useClass: LoggerServiceStub },
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    global.window.scroll = jest.fn();
    service = TestBed.inject(FormPlayerService);
    screenService = TestBed.inject(ScreenService);
    location = TestBed.inject(Location);
    logger = TestBed.inject(LoggerService);
    formPlayerApiService = TestBed.inject(FormPlayerApiService);
    orderId = 1234;
    service['_store'] = JSON.parse(JSON.stringify(response));
  });

  describe('checkIfOrderExist()', () => {
    it('should call checkIfOrderExist of formPlayerApiService when call ', () => {
      jest.spyOn<any, string>(formPlayerApiService, 'checkIfOrderExist');
      service.checkIfOrderExist();
      expect(formPlayerApiService.checkIfOrderExist).toHaveBeenCalled();
    });
  });

  describe('getOrderStatus()', () => {
    it('should call getOrderStatus of formPlayerApiService when call ', () => {
      const orderId = 1234;
      jest.spyOn<any, string>(formPlayerApiService, 'getOrderStatus');
      service.getOrderStatus(orderId);
      expect(formPlayerApiService.getOrderStatus).toHaveBeenCalledWith(orderId);
    });
  });

  describe('initData()', () => {
    it('should call updateLoading with true param', () => {
      jest.spyOn<any, string>(service, 'updateLoading');
      service.initData();
      expect(service['updateLoading']).toHaveBeenCalled();
    });

    it('should call getOrderData with orderId when isNeedToShowLastScreen return false and hasn\'t invited case', () => {
      jest.spyOn<any, string>(service, 'getOrderData');
      service.initData(orderId);
      expect(service['getOrderData']).toHaveBeenCalledWith(orderId);
    });
  });

  describe('getOrderData()', () => {
    it('should call getServiceData of formPlayerApiService when call getOrderData', () => {
      jest.spyOn<any, string>(formPlayerApiService, 'getServiceData');
      service.getOrderData(orderId);
      expect(formPlayerApiService.getServiceData).toHaveBeenCalled();
    });

    it('should call processResponse with response when call getOrderData with success response case', () => {
      jest.spyOn<any, string>(formPlayerApiService, 'getServiceData').mockReturnValue(of(response));
      jest.spyOn<any, string>(service, 'processResponse');
      service.getOrderData(orderId);
      expect(service.processResponse).toHaveBeenCalledWith(response);
    });

    it('should call sendDataError with error response when call getOrderData with error response case', () => {
      const errorResponse = {
        message: 'oops... i did it again',
        description: 'a-e-e-e-e-e...',
        status: 500,
      };
      jest.spyOn<any, string>(formPlayerApiService, 'getServiceData').mockReturnValue(throwError(errorResponse));
      jest.spyOn<any, string>(service, 'sendDataError');
      service.getOrderData(orderId);
      expect(service['sendDataError']).toHaveBeenCalledWith(errorResponse);
    });

    it('should call updateLoading with false param when call getOrderData', () => {
      jest.spyOn<any, string>(formPlayerApiService, 'getServiceData').mockReturnValue(of(response));
      jest.spyOn<any, string>(service, 'getOrderData');
      service.getOrderData(orderId);
      expect(service['getOrderData']).toHaveBeenCalled();
    });
  });

  describe('navigate()', () => {
    it('should call updateLoading with false true', () => {
      jest.spyOn<any, string>(service, 'updateLoading');
      service.navigate({}, FormPlayerNavigation.NEXT);
      expect(service['updateLoading']).toHaveBeenCalled();
    });

    it('should call updateRequest with prev-button param', () => {
      const navigation = {};
      jest.spyOn<any, string>(service, 'updateRequest');
      service.navigate(navigation, FormPlayerNavigation.NEXT);
      expect(service['updateRequest']).toHaveBeenCalledWith(navigation);
    });

    it('should call navigate of formPlayerApiService with params when call navigate', () => {
      const navigation = {};
      jest.spyOn<any, string>(formPlayerApiService, 'navigate');
      service.navigate(navigation, FormPlayerNavigation.NEXT);
      expect(formPlayerApiService.navigate).toHaveBeenCalled();
    });

    it('should call processResponse with response when call navigate with success response case', () => {
      const navigation = {};
      jest.spyOn<any, string>(formPlayerApiService, 'navigate').mockReturnValue(of(response));
      jest.spyOn<any, string>(service, 'processResponse');
      service.navigate(navigation, FormPlayerNavigation.NEXT);
      expect(service.processResponse).toHaveBeenCalledWith(response);
    });

    it('should call sendDataError with error response when call navigate with error response case', () => {
      const navigation = {};
      const errorResponse = {
        message: 'oops... i did it again',
        description: 'a-e-e-e-e-e...',
        status: 500,
      };
      jest.spyOn<any, string>(formPlayerApiService, 'navigate').mockReturnValue(throwError(errorResponse));
      jest.spyOn<any, string>(service, 'sendDataError');
      service.navigate(navigation, FormPlayerNavigation.NEXT);
      expect(service['sendDataError']).toHaveBeenCalledWith(errorResponse);
    });

    it('should call updateLoading with false param when call navigate', () => {
      const navigation = {};
      jest.spyOn<any, string>(formPlayerApiService, 'navigate').mockReturnValue(of(response));
      jest.spyOn<any, string>(service, 'updateLoading');
      service.navigate(navigation, FormPlayerNavigation.NEXT);
      expect(service['updateLoading']).toHaveBeenCalled();
    });
  });

  describe('getBooking()', () => {
    it('should call updateLoading with false true', () => {
      jest.spyOn<any, string>(service, 'updateLoading');
      service.getBooking();
      expect(service['updateLoading']).toHaveBeenCalled();
    });

    it('should call getBooking of formPlayerApiService', () => {
      jest.spyOn<any, string>(formPlayerApiService, 'getBooking');
      service.getBooking();
      expect(formPlayerApiService.getBooking).toHaveBeenCalled();
    });

    it('should call processResponse with response when call navigate with success response case', () => {
      jest.spyOn<any, string>(formPlayerApiService, 'getBooking').mockReturnValue(of(response));
      jest.spyOn<any, string>(service, 'processResponse');
      service.getBooking();
      expect(service.processResponse).toHaveBeenCalledWith(response);
    });

    it('should call sendDataError with error response when call navigate with error response case', () => {
      const errorResponse = {
        message: 'oops... i did it again',
        description: 'a-e-e-e-e-e...',
        status: 500,
      };
      jest.spyOn<any, string>(formPlayerApiService, 'getBooking').mockReturnValue(throwError(errorResponse));
      jest.spyOn<any, string>(service, 'sendDataError');
      service.getBooking();
      expect(service['sendDataError']).toHaveBeenCalledWith(errorResponse);
    });

    it('should call updateLoading with false param when call navigate', () => {
      jest.spyOn<any, string>(formPlayerApiService, 'getBooking').mockReturnValue(of(response));
      jest.spyOn<any, string>(service, 'updateLoading');
      service.getBooking();
      expect(service['updateLoading']).toHaveBeenCalled();
    });
  });

  describe('patchStore()', () => {
    it('should call updateLoading with false true', () => {
      jest.spyOn<any, string>(service, 'updateLoading');
      service.patchStore({});
      expect(service['updateLoading']).toHaveBeenCalled();
    });

    it('should call processResponse with new state', () => {
      const state = JSON.parse(JSON.stringify(response));
      const newScenarioDtoDiff = {
        display: {
          components: [
            {
              attrs: {},
              id: '1112',
              label: 'some label 3',
              type: 'some type',
              value: 'some value',
              required: false,
              visited: false,
            },
          ],
          header: 'some header',
          label: 'some label',
          id: '2222',
          name: 'some name 2',
          terminal: false,
          type: ScreenTypes.CUSTOM,
        },
      };
      state.scenarioDto = { ...state.scenarioDto, ...newScenarioDtoDiff };
      jest.spyOn<any, string>(service, 'processResponse');
      service.patchStore(newScenarioDtoDiff);
      expect(service['processResponse']).toHaveBeenCalledWith(state);
    });
  });

  describe('getQuizDataByToken()', () => {
    it('should call getQuizDataByToken with passed token', () => {
      const token = 'some token';
      jest.spyOn<any, string>(service, 'getQuizDataByToken');
      service.getQuizDataByToken(token);
      expect(service['getQuizDataByToken']).toHaveBeenCalledWith(token);
    });
  });

  describe('initPlayerFromQuiz()', () => {
    it('should call updateLoading with false true', () => {
      const quiz = { ...response, serviceId: '', targetId: '', answerServicePrefix: '' };
      jest.spyOn<any, string>(service, 'updateLoading');
      service.initPlayerFromQuiz(quiz);
      expect(service['updateLoading']).toHaveBeenCalled();
    });

    it('should call navigate of formPlayerApiService with params when call navigate', () => {
      const quiz = { ...response, serviceId: '', targetId: '', answerServicePrefix: '' };
      jest.spyOn<any, string>(formPlayerApiService, 'quizToOrder');
      service.initPlayerFromQuiz(quiz);
      expect(formPlayerApiService.quizToOrder).toHaveBeenCalled();
    });

    it('should call sendDataError with error response when call navigate with error response case', () => {
      const quiz = { ...response, serviceId: '', targetId: '', answerServicePrefix: '' };
      const errorResponse = {
        message: 'oops... i did it again',
        description: 'a-e-e-e-e-e...',
        status: 500,
      };
      jest.spyOn<any, string>(formPlayerApiService, 'quizToOrder').mockReturnValue(throwError(errorResponse));
      jest.spyOn<any, string>(service, 'sendDataError');
      service.initPlayerFromQuiz(quiz);
      expect(service['sendDataError']).toHaveBeenCalledWith(errorResponse);
    });

    it('should call updateLoading with false param when call navigate', () => {
      const quiz = { ...response, serviceId: '', targetId: '', answerServicePrefix: '' };
      jest.spyOn<any, string>(formPlayerApiService, 'navigate').mockReturnValue(of(response));
      jest.spyOn<any, string>(service, 'updateLoading');
      service.initPlayerFromQuiz(quiz);
      expect(service['updateLoading']).toHaveBeenCalled();
    });
  });

  describe('initPlayerFromOrder()', () => {
    it('should call updateLoading(true) before getServiceData', () => {
      jest.spyOn<any, string>(service, 'updateLoading');

      const getServiceDataSubject = new Subject();

      jest
        .spyOn(formPlayerApiService, 'getServiceData')
        // @ts-ignore
        .mockReturnValue(getServiceDataSubject.asObservable());

      service.initPlayerFromOrder({});

      expect(service['updateLoading']).toHaveBeenCalledTimes(1);
      expect(service['updateLoading']).toHaveBeenCalledWith(true);
    });

    it('should handle error', (done) => {
      jest.spyOn<any, string>(service, 'updateLoading').mockImplementation(() => undefined);
      jest.spyOn<any, string>(service, 'sendDataError').mockImplementation(() => undefined);

      const getServiceDataSubject = new Subject();

      jest
        .spyOn(formPlayerApiService, 'getServiceData')
        // @ts-ignore
        .mockReturnValue(getServiceDataSubject.asObservable());

      service.initPlayerFromOrder({}).subscribe(
        () => null,
        (err) => {
          expect(err).toBe('some error');

          expect(service['sendDataError']).toBeCalledTimes(1);
          expect(service['sendDataError']).toBeCalledWith('some error');
          done();
        },
      );

      (service['updateLoading'] as jest.Mock).mockReset();

      getServiceDataSubject.error('some error');

      expect(service['updateLoading']).toBeCalledTimes(1);
      expect(service['updateLoading']).toBeCalledWith(false);
    });

    it('should handle success', (done) => {
      jest.spyOn<any, string>(service, 'updateLoading').mockImplementation(() => undefined);
      jest.spyOn<any, string>(service, 'processResponse').mockImplementation(() => undefined);
      jest.spyOn<any, string>(service, 'hasError').mockReturnValue(false);

      const successGetServiceDataResponse = {} as FormPlayerApiResponse;
      const successNavigateResponse = {} as FormPlayerApiResponse;

      const getServiceDataSubject = new Subject();
      const navigateSubject = new Subject();

      jest
        .spyOn(formPlayerApiService, 'getServiceData')
        // @ts-ignore
        .mockReturnValue(getServiceDataSubject.asObservable());
      jest.spyOn<any, string>(formPlayerApiService, 'navigate').mockReturnValue(navigateSubject.asObservable());

      service.initPlayerFromOrder({}).subscribe((response) => {
        expect(response).toBe(successNavigateResponse);

        expect(service['processResponse']).toBeCalledTimes(1);
        expect(service['processResponse']).toBeCalledWith(successNavigateResponse);
        done();
      });

      getServiceDataSubject.next(successGetServiceDataResponse);
      navigateSubject.next(successNavigateResponse);
    });
  });

  describe('processResponse()', () => {
    it('should call hasError with response param', () => {
      jest.spyOn<any, string>(service, 'hasError');
      service.processResponse(response);
      expect(service['hasError']).toHaveBeenCalledWith(response);
    });

    it('should call sendDataError with response param when hasError return true', () => {
      jest.spyOn<any, string>(service, 'hasError').mockReturnValue(true);
      jest.spyOn<any, string>(service, 'sendDataError');
      service.processResponse(response);
      expect(service['sendDataError']).toHaveBeenCalledWith(response);
    });

    it('should call sendDataSuccess with response param when hasError return false', () => {
      jest.spyOn<any, string>(service, 'hasError').mockReturnValue(false);
      jest.spyOn<any, string>(service, 'sendDataSuccess');
      service.processResponse(response);
      expect(service['sendDataSuccess']).toHaveBeenCalledWith(response);
    });

    it('should call resetViewByChangeScreen with response param when hasError return false', () => {
      jest.spyOn<any, string>(service, 'hasError').mockReturnValue(false);
      jest.spyOn<any, string>(service, 'resetViewByChangeScreen');
      service.processResponse(response);
      expect(service['resetViewByChangeScreen']).toHaveBeenCalled();
    });
  });

  describe('resetViewByChangeScreen()', () => {
    it('should call scroll method of window  with (0, 0) params', () => {
      const window = TestBed.inject(WINDOW);
      jest.spyOn<any, string>(window, 'scroll');
      service['resetViewByChangeScreen']();
      expect(window['scroll']).toHaveBeenCalledWith(0, 0);
    });
  });

  describe('hasError()', () => {
    it('should return true if hasRequestErrors', () => {
      jest.spyOn<any, string>(service, 'hasRequestErrors').mockReturnValue(true);
      const hasError = service['hasError'](response);
      expect(hasError).toBeTruthy();
    });

    it('should return true if hasBusinessErrors', () => {
      jest.spyOn<any, string>(service, 'hasBusinessErrors').mockReturnValue(true);
      const hasError = service['hasError'](response);
      expect(hasError).toBeTruthy();
    });

    it('should return false if not hasRequestErrors and not hasBusinessErrors', () => {
      jest.spyOn<any, string>(service, 'hasRequestErrors').mockReturnValue(false);
      jest.spyOn<any, string>(service, 'hasBusinessErrors').mockReturnValue(false);
      const hasError = service['hasError'](response);
      expect(hasError).toBeFalsy();
    });
  });

  describe('hasRequestErrors()', () => {
    it('should return true if response have badRequest status', () => {
      const errorResponse = {
        description: 'oooh some error here',
        message: 'oooh some error here',
        status: FormPlayerApiErrorStatuses.badRequest,
      };
      const hasRequestErrors = service['hasRequestErrors'](errorResponse);
      expect(hasRequestErrors).toBeTruthy();
    });

    it('should return false if response haven\'t any error status', () => {
      const hasRequestErrors = service['hasError'](response);
      expect(hasRequestErrors).toBeFalsy();
    });
  });

  describe('hasBusinessErrors()', () => {
    it('should return true if response have business errors', () => {
      const errorResponse = JSON.parse(JSON.stringify(response));
      errorResponse.scenarioDto.errors = { error: 'error message here' };
      const hasBusinessErrors = service['hasBusinessErrors'](errorResponse);
      expect(hasBusinessErrors).toBeTruthy();
    });

    it('should return false if response haven\'t any business error', () => {
      const hasBusinessErrors = service['hasBusinessErrors'](response);
      expect(hasBusinessErrors).toBeFalsy();
    });
  });

  describe('updateRequest()', () => {
    let navigation;

    beforeEach(() => {
      navigation = {
        payload: {
          k1: {
            value: 'some value',
            visited: true,
          },
        },
      };
    });

    it('should call log of loggerService', () => {
      jest.spyOn<any, string>(logger, 'log');
      service['updateRequest'](navigation);
      expect(logger.log).toBeCalled();
    });

    it('should call isEmptyNavigationPayload with param', () => {
      jest.spyOn<any, string>(service, 'isEmptyNavigationPayload');
      service['updateRequest'](navigation);
      expect(service['isEmptyNavigationPayload']).toBeCalledWith(navigation.payload);
    });

    it('should call setDefaultCurrentValue when isEmptyNavigationPayload return true', () => {
      jest.spyOn<any, string>(service, 'isEmptyNavigationPayload').mockReturnValue(true);
      jest.spyOn<any, string>(service, 'setDefaultCurrentValue');
      service['updateRequest'](navigation);
      expect(service['setDefaultCurrentValue']).toBeCalled();
    });

    it('should set prev-button.payload as currentValue when isEmptyNavigationPayload return false', () => {
      jest.spyOn<any, string>(service, 'isEmptyNavigationPayload').mockReturnValue(false);
      service['updateRequest'](navigation);
      expect(service['_store'].scenarioDto.currentValue).toBe(navigation.payload);
    });

    it('should update store when prev-button.options has store', () => {
      const newStore = JSON.parse(JSON.stringify(response));
      navigation = {
        options: {
          store: newStore,
        },
      };
      jest.spyOn<any, string>(service, 'isEmptyNavigationPayload').mockReturnValue(false);
      service['updateRequest'](navigation);
      expect(service['_store']).toBe(navigation.options.store);
    });
  });

  describe('setDefaultCurrentValue()', () => {
    it('should set default currentValue by first component', () => {
      navigation = {};
      const defaultCurrentValue = {
        [response.scenarioDto.display.components[0].id]: {
          value: '',
          visited: true,
        },
      };
      service['setDefaultCurrentValue']();
      expect(service['_store'].scenarioDto.currentValue).toEqual(defaultCurrentValue);
    });
  });

  describe('isEmptyNavigationPayload()', () => {
    it('should return true if hasn\'t payload with keys', () => {
      navigation = { payload: {}};
      const isEmptyNavigationPayload = service['isEmptyNavigationPayload'](navigation.payload);
      expect(isEmptyNavigationPayload).toBeTruthy();
    });

    it('should return true if hasn\'t payload with keys', () => {
      navigation = {};
      const isEmptyNavigationPayload = service['isEmptyNavigationPayload'](navigation.payload);
      expect(isEmptyNavigationPayload).toBeTruthy();
    });

    it('should return false if hasn\'t payload with keys', () => {
      navigation = { payload: { k1: { value: '', visited: true }}};
      const isEmptyNavigationPayload = service['isEmptyNavigationPayload'](navigation.payload);
      expect(isEmptyNavigationPayload).toBeFalsy();
    });
  });

  describe('sendDataSuccess()', () => {
    it('should call log of loggerService', () => {
      jest.spyOn<any, string>(logger, 'log');
      service['sendDataSuccess'](response);
      expect(logger.log).toBeCalled();
    });

    it('should call initResponse with response param', () => {
      jest.spyOn<any, string>(service, 'initResponse');
      service['sendDataSuccess'](response);
      expect(service['initResponse']).toBeCalledWith(response);
    });
  });

  describe('sendDataError()', () => {
    let errorResponse;

    beforeEach(() => {
      errorResponse = JSON.parse(JSON.stringify(response));
      errorResponse.scenarioDto.errors = { error: 'error message here' };
    });

    it('should call error of loggerService', () => {
      jest.spyOn<any, string>(logger, 'error');
      service['sendDataError'](errorResponse);
      expect(logger.error).toBeCalled();
    });

    it('should call initResponse with response param when response has business errors', () => {
      jest.spyOn<any, string>(service, 'initResponse');
      service['sendDataError'](errorResponse);
      expect(service['initResponse']).toBeCalledWith(errorResponse);
    });

    it('shouldn\'t call initResponse with response param when response error status', () => {
      const errorResponse = {
        message: 'oops... i did it again',
        description: 'a-e-e-e-e-e...',
        status: 500,
      };
      jest.spyOn<any, string>(service, 'initResponse');
      // @ts-ignore
      service['sendDataError'](errorResponse);
      expect(service['initResponse']).not.toBeCalled();
    });

    it('should call updateLoading with false param', () => {
      jest.spyOn<any, string>(service, 'updateLoading');
      service['sendDataError'](errorResponse);
      expect(service['updateLoading']).toBeCalledWith(false);
    });
  });

  describe('initResponse()', () => {
    it('should call handleInvalidResponse when empty response', () => {
      jest.spyOn<any, string>(service, 'handleInvalidResponse');
      service['initResponse'](null);
      expect(service['handleInvalidResponse']).toBeCalled();
    });

    it('should set store from response', () => {
      const newResponse = JSON.parse(JSON.stringify(response));
      jest.spyOn<any, string>(service, 'initResponse');
      service['initResponse'](newResponse);
      expect(service['_store']).toBe(newResponse);
    });

    it('should call initScreenStore with scenarioDto param', () => {
      jest.spyOn<any, string>(service, 'initScreenStore');
      service['initResponse'](response);
      expect(service['initScreenStore']).toBeCalledWith(response.scenarioDto);
    });

    it('should call updatePlayerLoaded with true param', () => {
      jest.spyOn<any, string>(service, 'updatePlayerLoaded');
      service['initResponse'](response);
      expect(service['updatePlayerLoaded']).toBeCalledWith(true);
    });

    it('should call log of loggerService', () => {
      jest.spyOn<any, string>(logger, 'log');
      service['initResponse'](response);
      expect(logger.log).toBeCalled();
    });
  });

  describe('handleInvalidResponse()', () => {
    it('should call error of loggerService', () => {
      jest.spyOn<any, string>(logger, 'error');
      service['handleInvalidResponse']();
      expect(logger.error).toBeCalled();
    });
  });

  describe('get store()', () => {
    it('should return store', () => {
      const store = service.store;
      expect(store).toBe(service['_store']);
    });
  });

  describe('initScreenStore()', () => {
    it('should call initScreenStore of screenService with scenarioDto', () => {
      jest.spyOn<any, string>(screenService, 'initScreenStore');
      service['initScreenStore'](response.scenarioDto);
      expect(screenService.initScreenStore).toBeCalledWith(response.scenarioDto);
    });
  });

  describe('updateLoading()', () => {
    it('should set isLoading by new value', () => {
      service['updateLoading'](true);
      expect(service['isLoading']).toBe(true);
    });

    it('should call isLoadingSubject next with new value', () => {
      jest.spyOn<any, string>(service['isLoadingSubject'], 'next');
      service['updateLoading'](true);
      expect(service['isLoadingSubject'].next).toBeCalledWith(true);
    });

    it('should call updateLoading of screenService with new value', () => {
      jest.spyOn<any, string>(screenService, 'updateLoading');
      service['updateLoading'](true);
      expect(screenService.updateLoading).toBeCalledWith(true);
    });
  });

  describe('updatePlayerLoaded()', () => {
    it('should set playerLoaded by new value', () => {
      service['updatePlayerLoaded'](true);
      expect(service['playerLoaded']).toBe(true);
    });

    it('should call playerLoadedSubject next with new value', () => {
      jest.spyOn<any, string>(service['playerLoadedSubject'], 'next');
      service['updatePlayerLoaded'](true);
      expect(service['playerLoadedSubject'].next).toBeCalledWith(true);
    });
  });

  describe('augmentDisplayId', () => {
    it('should update display.id in successResponse with last id from finishedAndCurrentScreens', () => {
      const successResponse = ({
        scenarioDto: { display: 'id' },
      } as unknown) as FormPlayerApiSuccessResponse;
      const otherScenario = { finishedAndCurrentScreens: ['id1', 'id2'] };
      service['augmentDisplayId'](successResponse, otherScenario);
      expect(successResponse.scenarioDto.display.id).toBe('id2');
    });
  });
});
