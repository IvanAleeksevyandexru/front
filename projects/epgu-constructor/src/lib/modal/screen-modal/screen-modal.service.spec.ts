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

  beforeEach(() => {
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
      const spy = jest.spyOn<any, string>(service, 'updatePlayerLoaded');
      service.resetStore();
      expect(spy).toBeCalledWith(false);
    });

    it('should set _store as null', () => {
      jest.spyOn<any, string>(service, 'updateLoading');
      service.resetStore();
      expect(service['_store']).toBe(null);
    });

    it('should set _initStore as null', () => {
      jest.spyOn<any, string>(service, 'updateLoading');
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
      const spy = jest.spyOn<any, string>(service, 'hasError');
      service.processResponse(response);
      expect(spy).toHaveBeenCalledWith(response);
    });

    it('should call sendDataError with response param when hasError return true', () => {
      jest.spyOn<any, string>(service, 'hasError').mockReturnValue(true);
      const spy = jest.spyOn<any, string>(service, 'sendDataError');
      service.processResponse(response);
      expect(spy).toHaveBeenCalledWith(response);
    });

    it('should call sendDataSuccess with response param when hasError return false', () => {
      jest.spyOn<any, string>(service, 'hasError').mockReturnValue(false);
      const spy = jest.spyOn<any, string>(service, 'sendDataSuccess');
      service.processResponse(response);
      expect(spy).toHaveBeenCalledWith(response);
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
      const spy = jest.spyOn<any, string>(logger, 'log');
      service['updateRequest'](navigation);
      expect(spy).toBeCalled();
    });

    it('should call isEmptyNavigationPayload with param', () => {
      const spy = jest.spyOn<any, string>(service, 'isEmptyNavigationPayload');
      service['updateRequest'](navigation);
      expect(spy).toBeCalledWith(navigation.payload);
    });

    it('should call setDefaultCurrentValue when isEmptyNavigationPayload return true', () => {
      jest.spyOn<any, string>(service, 'isEmptyNavigationPayload').mockReturnValue(true);
      const spy = jest.spyOn<any, string>(service, 'setDefaultCurrentValue');
      service['updateRequest'](navigation);
      expect(spy).toBeCalled();
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
      const spy = jest.spyOn<any, string>(logger, 'log');
      service['sendDataSuccess'](response);
      expect(spy).toBeCalled();
    });

    it('should call initResponse with response param', () => {
      const spy = jest.spyOn<any, string>(service, 'initResponse');
      service['sendDataSuccess'](response);
      expect(spy).toBeCalledWith(response);
    });
  });

  describe('sendDataError()', () => {
    let errorResponse;

    beforeEach(() => {
      errorResponse = JSON.parse(JSON.stringify(response));
      errorResponse.scenarioDto.errors = { error: 'error message here' };
    });

    it('should call error of loggerService', () => {
      const spy = jest.spyOn<any, string>(logger, 'error');
      service['sendDataError'](errorResponse);
      expect(spy).toBeCalled();
    });

    it('should call initResponse with response param when response has business errors', () => {
      const spy = jest.spyOn<any, string>(service, 'initResponse');
      service['sendDataError'](errorResponse);
      expect(spy).toBeCalledWith(errorResponse);
    });

    it('shouldn\'t call initResponse with response param when response error status', () => {
      const errorResponse = {
        message: 'oops... i did it again',
        description: 'a-e-e-e-e-e...',
        status: 500,
      };
      const spy = jest.spyOn<any, string>(service, 'initResponse');
      // @ts-ignore
      service['sendDataError'](errorResponse);
      expect(service['initResponse']).not.toBeCalled();
    });

    it('should call updateLoading with false param', () => {
      const spy = jest.spyOn<any, string>(service, 'updateLoading');
      service['sendDataError'](errorResponse);
      expect(spy).toBeCalledWith(false);
    });
  });

  describe('initResponse()', () => {
    it('should call handleInvalidResponse when empty response', () => {
      const spy = jest.spyOn<any, string>(service, 'handleInvalidResponse');
      service['initResponse'](null);
      expect(spy).toBeCalled();
    });

    it('should set store from response', () => {
      const newResponse = JSON.parse(JSON.stringify(response));
      jest.spyOn<any, string>(service, 'initResponse');
      service['initResponse'](newResponse);
      expect(service['_store']).toBe(newResponse);
    });

    it('should call initScreenStore with scenarioDto param', () => {
      const spy = jest.spyOn<any, string>(service, 'initScreenStore');
      service['initResponse'](response);
      expect(spy).toBeCalledWith(response.scenarioDto);
    });

    it('should call updatePlayerLoaded with true param', () => {
      const spy = jest.spyOn<any, string>(service, 'updatePlayerLoaded');
      service['initResponse'](response);
      expect(spy).toBeCalledWith(true);
    });

    it('should call log of loggerService', () => {
      const spy = jest.spyOn<any, string>(logger, 'log');
      service['initResponse'](response);
      expect(spy).toBeCalled();
    });
  });

  describe('handleInvalidResponse()', () => {
    it('should call error of loggerService', () => {
      const spy = jest.spyOn<any, string>(logger, 'error');
      service['handleInvalidResponse']();
      expect(spy).toBeCalled();
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
      const spy = jest.spyOn<any, string>(screenService, 'initScreenStore');
      service['initScreenStore'](response.scenarioDto);
      expect(spy).toBeCalledWith(response.scenarioDto);
    });
  });

  describe('updateLoading()', () => {
    it('should set isLoading by new value', () => {
      service['updateLoading'](true);
      expect(service['isLoading']).toBe(true);
    });

    it('should call isLoadingSubject next with new value', () => {
      const spy = jest.spyOn<any, string>(service['isLoadingSubject'], 'next');
      service['updateLoading'](true);
      expect(spy).toBeCalledWith(true);
    });

    it('should call updateLoading of screenService with new value', () => {
      const spy = jest.spyOn<any, string>(screenService, 'updateLoading');
      service['updateLoading'](true);
      expect(spy).toBeCalledWith(true);
    });
  });

  describe('updatePlayerLoaded()', () => {
    it('should set playerLoaded by new value', () => {
      service['updatePlayerLoaded'](true);
      expect(service['playerLoaded']).toBe(true);
    });

    it('should call playerLoadedSubject next with new value', () => {
      const spy = jest.spyOn<any, string>(service['playerLoadedSubject'], 'next');
      service['updatePlayerLoaded'](true);
      expect(spy).toBeCalledWith(true);
    });
  });
});
