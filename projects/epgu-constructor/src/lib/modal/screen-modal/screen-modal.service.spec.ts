import { TestBed } from '@angular/core/testing';
import { LoggerService } from '@epgu/epgu-constructor-ui-kit';
import { LoggerServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { Navigation } from '../../form-player/form-player.types';
import { FormPlayerApiService } from '../../form-player/services/form-player-api/form-player-api.service';
import { FormPlayerApiServiceStub } from '../../form-player/services/form-player-api/form-player-api.service.stub';
import { FormPlayerService } from '../../form-player/services/form-player/form-player.service';
import { FormPlayerServiceStub } from '../../form-player/services/form-player/form-player.service.stub';
import { ScreenService } from '../../screen/screen.service';
import { ScreenServiceStub } from '../../screen/screen.service.stub';
import { HtmlRemoverService } from '../../shared/services/html-remover/html-remover.service';
import { ScreenModalService } from './screen-modal.service';
import { configureTestSuite } from 'ng-bullet';
import { FormPlayerApiErrorStatuses } from '@epgu/epgu-constructor-types';

const response = new FormPlayerServiceStub()._store;

describe('ScreenModalService', () => {
  let service: ScreenModalService;
  let screenService: ScreenService;
  let formPlayerService: FormPlayerService;
  let formPlayerApiService: FormPlayerApiService;
  let logger: LoggerService;
  let orderId: number;
  let navigation: Navigation;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        ScreenModalService,
        ScreenService,
        HtmlRemoverService,
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: FormPlayerService, useClass: FormPlayerServiceStub },
        { provide: FormPlayerApiService, useClass: FormPlayerApiServiceStub },
        { provide: LoggerService, useClass: LoggerServiceStub },
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(ScreenModalService);
    screenService = TestBed.inject(ScreenService);
    logger = TestBed.inject(LoggerService);
    formPlayerService = TestBed.inject(FormPlayerService);
    formPlayerApiService = TestBed.inject(FormPlayerApiService);
    orderId = 1234;
    service['_store'] = JSON.parse(JSON.stringify(response));
  });

  describe('resetStore()', () => {
    it('should call updateLoading of screenService with false', () => {
      spyOn<any>(service, 'updatePlayerLoaded').and.callThrough();
      service.resetStore();
      expect(service['updatePlayerLoaded']).toBeCalledWith(false);
    });

    it('should set _store as null', () => {
      spyOn<any>(service, 'updateLoading').and.callThrough();
      service.resetStore();
      expect(service['_store']).toBe(null);
    });

    it('should set _initStore as null', () => {
      spyOn<any>(service, 'updateLoading').and.callThrough();
      service.resetStore();
      expect(service['_initStore']).toBe(null);
    });
  });

  describe('get initStore()', () => {
    it('should return initStore', () => {
      const initStore = service.initStore;
      expect(initStore).toBe(service['_initStore']);
    });
  });

  describe('processResponse()', () => {
    it('should call hasError with response param', () => {
      spyOn<any>(service, 'hasError').and.callThrough();
      service.processResponse(response);
      expect(service['hasError']).toHaveBeenCalledWith(response);
    });

    it('should call sendDataError with response param when hasError return true', () => {
      spyOn<any>(service, 'hasError').and.returnValue(true);
      spyOn<any>(service, 'sendDataError').and.callThrough();
      service.processResponse(response);
      expect(service['sendDataError']).toHaveBeenCalledWith(response);
    });

    it('should call sendDataSuccess with response param when hasError return false', () => {
      spyOn<any>(service, 'hasError').and.returnValue(false);
      spyOn<any>(service, 'sendDataSuccess').and.callThrough();
      service.processResponse(response);
      expect(service['sendDataSuccess']).toHaveBeenCalledWith(response);
    });
  });

  describe('hasError()', () => {
    it('should return true if hasRequestErrors', () => {
      spyOn<any>(service, 'hasRequestErrors').and.returnValue(true);
      const hasError = service['hasError'](response);
      expect(hasError).toBeTruthy();
    });

    it('should return true if hasBusinessErrors', () => {
      spyOn<any>(service, 'hasBusinessErrors').and.returnValue(true);
      const hasError = service['hasError'](response);
      expect(hasError).toBeTruthy();
    });

    it('should return false if not hasRequestErrors and not hasBusinessErrors', () => {
      spyOn<any>(service, 'hasRequestErrors').and.returnValue(false);
      spyOn<any>(service, 'hasBusinessErrors').and.returnValue(false);
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
      spyOn<any>(logger, 'log').and.callThrough();
      service['updateRequest'](navigation);
      expect(logger.log).toBeCalled();
    });

    it('should call isEmptyNavigationPayload with param', () => {
      spyOn<any>(service, 'isEmptyNavigationPayload').and.callThrough();
      service['updateRequest'](navigation);
      expect(service['isEmptyNavigationPayload']).toBeCalledWith(navigation.payload);
    });

    it('should call setDefaultCurrentValue when isEmptyNavigationPayload return true', () => {
      spyOn<any>(service, 'isEmptyNavigationPayload').and.returnValue(true);
      spyOn<any>(service, 'setDefaultCurrentValue').and.callThrough();
      service['updateRequest'](navigation);
      expect(service['setDefaultCurrentValue']).toBeCalled();
    });

    it('should set prev-button.payload as currentValue when isEmptyNavigationPayload return false', () => {
      spyOn<any>(service, 'isEmptyNavigationPayload').and.returnValue(false);
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
      spyOn<any>(service, 'isEmptyNavigationPayload').and.returnValue(false);
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
      spyOn<any>(logger, 'log').and.callThrough();
      service['sendDataSuccess'](response);
      expect(logger.log).toBeCalled();
    });

    it('should call initResponse with response param', () => {
      spyOn<any>(service, 'initResponse').and.callThrough();
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
      spyOn<any>(logger, 'error').and.callThrough();
      service['sendDataError'](errorResponse);
      expect(logger.error).toBeCalled();
    });

    it('should call initResponse with response param when response has business errors', () => {
      spyOn<any>(service, 'initResponse').and.callThrough();
      service['sendDataError'](errorResponse);
      expect(service['initResponse']).toBeCalledWith(errorResponse);
    });

    it('shouldn\'t call initResponse with response param when response error status', () => {
      const errorResponse = {
        message: 'oops... i did it again',
        description: 'a-e-e-e-e-e...',
        status: 500,
      };
      spyOn<any>(service, 'initResponse').and.callThrough();
      // @ts-ignore
      service['sendDataError'](errorResponse);
      expect(service['initResponse']).not.toBeCalled();
    });

    it('should call updateLoading with false param', () => {
      spyOn<any>(service, 'updateLoading').and.callThrough();
      service['sendDataError'](errorResponse);
      expect(service['updateLoading']).toBeCalledWith(false);
    });
  });

  describe('initResponse()', () => {
    it('should call handleInvalidResponse when empty response', () => {
      spyOn<any>(service, 'handleInvalidResponse').and.callThrough();
      service['initResponse'](null);
      expect(service['handleInvalidResponse']).toBeCalled();
    });

    it('should set store from response', () => {
      const newResponse = JSON.parse(JSON.stringify(response));
      spyOn<any>(service, 'initResponse').and.callThrough();
      service['initResponse'](newResponse);
      expect(service['_store']).toBe(newResponse);
    });

    it('should call initScreenStore with scenarioDto param', () => {
      spyOn<any>(service, 'initScreenStore').and.callThrough();
      service['initResponse'](response);
      expect(service['initScreenStore']).toBeCalledWith(response.scenarioDto);
    });

    it('should call updatePlayerLoaded with true param', () => {
      spyOn<any>(service, 'updatePlayerLoaded').and.callThrough();
      service['initResponse'](response);
      expect(service['updatePlayerLoaded']).toBeCalledWith(true);
    });

    it('should call log of loggerService', () => {
      spyOn<any>(logger, 'log').and.callThrough();
      service['initResponse'](response);
      expect(logger.log).toBeCalled();
    });
  });

  describe('handleInvalidResponse()', () => {
    it('should call error of loggerService', () => {
      spyOn<any>(logger, 'error').and.callThrough();
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
      spyOn<any>(screenService, 'initScreenStore').and.callThrough();
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
      spyOn<any>(service['isLoadingSubject'], 'next').and.callThrough();
      service['updateLoading'](true);
      expect(service['isLoadingSubject'].next).toBeCalledWith(true);
    });

    it('should call updateLoading of screenService with new value', () => {
      spyOn<any>(screenService, 'updateLoading').and.callThrough();
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
      spyOn<any>(service['playerLoadedSubject'], 'next').and.callThrough();
      service['updatePlayerLoaded'](true);
      expect(service['playerLoadedSubject'].next).toBeCalledWith(true);
    });
  });
});
