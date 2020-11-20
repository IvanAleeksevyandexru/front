import { TestBed } from '@angular/core/testing';

import { FormPlayerService } from './form-player.service';
import { ScreenService } from '../../../screen/screen.service';
import { FormPlayerApiService } from '../form-player-api/form-player-api.service';
import { FormPlayerApiServiceStub } from '../form-player-api/form-player-api.service.stub';
import { CachedAnswersService } from '../../../shared/services/applicant-answers/cached-answers.service';
import { CurrentAnswersService } from '../../../screen/current-answers.service';
import { ServiceDataService } from '../service-data/service-data.service';
import { Location } from '@angular/common';
import { COMPONENT_DATA_KEY } from '../../../shared/constants/form-player';
import { of, throwError } from 'rxjs';
import { FormPlayerServiceStub } from './form-player.service.stub';
import { FormPlayerNavigation } from '../../form-player.types';
import { WINDOW, WINDOW_PROVIDERS } from '../../../core/providers/window.provider';
import { FormPlayerApiErrorStatuses } from '../form-player-api/form-player-api.types';
import { LoggerService } from '../../../core/services/logger/logger.service';
import { LoggerServiceStub } from '../../../core/services/logger/logger.service.stub';

const response = new FormPlayerServiceStub().response;

describe('FormPlayerService', () => {
  let service: FormPlayerService;
  let formPlayerApiService: FormPlayerApiService;
  let location: Location;
  let orderId: string;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FormPlayerService,
        ScreenService,
        ServiceDataService,
        CachedAnswersService,
        CurrentAnswersService,
        Location,
        WINDOW_PROVIDERS,
        { provide: FormPlayerApiService, useClass: FormPlayerApiServiceStub },
        { provide: LoggerService, useClass: LoggerServiceStub },
      ]
    });
    service = TestBed.inject(FormPlayerService);
    location = TestBed.inject(Location);
    formPlayerApiService = TestBed.inject(FormPlayerApiService);
  });

  beforeEach(() => {
    orderId = '1234';
    service['_store'] = JSON.parse(JSON.stringify(response));
  });

  describe('checkIfOrderExist()',() => {
    it('should call checkIfOrderExist of formPlayerApiService when call ', () => {
      spyOn(formPlayerApiService, 'checkIfOrderExist').and.callThrough();
      service.checkIfOrderExist();
      expect(formPlayerApiService.checkIfOrderExist).toHaveBeenCalled();
    });
  });

  describe('isNeedToShowLastScreen()',() => {
    it('should return true', () => {
      location.go('/some-page', 'getLastScreen=true');
      localStorage.setItem(COMPONENT_DATA_KEY, '{}');
      expect(service['isNeedToShowLastScreen']()).toBeTruthy();
      localStorage.removeItem(COMPONENT_DATA_KEY);
    });

    it('should return false', () => {
      expect(service['isNeedToShowLastScreen']()).toBeFalsy();
    });

    it('should call isHaveOrderDataInLocalStorage if location has getLastScreen param', () => {
      spyOn<any>(service, 'isHaveOrderDataInLocalStorage').and.callThrough();
      location.go('/some-page', 'getLastScreen=true');
      service['isNeedToShowLastScreen']();
      expect(service['isHaveOrderDataInLocalStorage']).toHaveBeenCalled();
    });

    it('shouldn\'t call isHaveOrderDataInLocalStorage if location hasn\'t getLastScreen param', () => {
      spyOn<any>(service, 'isHaveOrderDataInLocalStorage').and.callThrough();
      location.go('/some-page');
      service['isNeedToShowLastScreen']();
      expect(service['isHaveOrderDataInLocalStorage']).not.toHaveBeenCalled();
    });
  });

  describe('isHaveOrderDataInLocalStorage()',() => {
    it('should return true', () => {
      localStorage.setItem(COMPONENT_DATA_KEY, '{}');
      expect(service['isHaveOrderDataInLocalStorage']()).toBeTruthy();
      localStorage.removeItem(COMPONENT_DATA_KEY);
    });

    it('should return false', () => {
      expect(service['isHaveOrderDataInLocalStorage']()).toBeFalsy();
    });
  });

  describe('initData()',() => {
    it('should call updateLoading with true param', () => {
      spyOn<any>(service, 'updateLoading').and.callThrough();
      service.initData();
      expect(service['updateLoading']).toHaveBeenCalled();
    });

    it('should call isNeedToShowLastScreen', () => {
      spyOn<any>(service, 'isNeedToShowLastScreen').and.callThrough();
      service.initData();
      expect(service['isNeedToShowLastScreen']).toHaveBeenCalled();
    });

    it('should call loadDataFromLocalStorage when isNeedToShowLastScreen return true', () => {
      spyOn<any>(service, 'isNeedToShowLastScreen').and.returnValue(true);
      spyOn<any>(service, 'loadDataFromLocalStorage').and.callThrough();
      service.initData();
      expect(service['loadDataFromLocalStorage']).toHaveBeenCalled();
    });

    it('should call loadDataFromLocalStorage when isNeedToShowLastScreen return true', () => {
      spyOn<any>(service, 'isNeedToShowLastScreen').and.returnValue(true);
      spyOn<any>(service, 'loadDataFromLocalStorage').and.callThrough();
      service.initData();
      expect(service['loadDataFromLocalStorage']).toHaveBeenCalled();
    });

    it('should call getInviteOrderData with orderId when isNeedToShowLastScreen return false and has invited case', () => {
      spyOn<any>(service, 'isNeedToShowLastScreen').and.returnValue(false);
      spyOn<any>(service, 'getInviteOrderData').and.callThrough();
      service.initData(orderId, true);
      expect(service['getInviteOrderData']).toHaveBeenCalledWith(orderId);
    });

    it('should call getOrderData with orderId when isNeedToShowLastScreen return false and hasn\'t invited case', () => {
      spyOn<any>(service, 'isNeedToShowLastScreen').and.returnValue(false);
      spyOn<any>(service, 'getOrderData').and.callThrough();
      service.initData(orderId, false);
      expect(service['getOrderData']).toHaveBeenCalledWith(orderId);
    });
  });

  describe('getInviteOrderData()',() => {
    it('should call getInviteServiceData of formPlayerApiService when call getInviteOrderData', () => {
      spyOn(formPlayerApiService, 'getInviteServiceData').and.callThrough();
      service.getInviteOrderData(orderId);
      expect(formPlayerApiService.getInviteServiceData).toHaveBeenCalled();
    });

    it('should call processResponse with response when call getInviteOrderData with success response case', () => {
      spyOn(formPlayerApiService, 'getInviteServiceData').and.returnValue(of(response));
      spyOn<any>(service, 'processResponse').and.callThrough();
      service.getInviteOrderData(orderId);
      expect(service.processResponse).toHaveBeenCalledWith(response);
    });

    it('should call sendDataError with error response when call getInviteOrderData with error response case', () => {
      const errorResponse = {
        message: 'oops... i did it again',
        description: 'a-e-e-e-e-e...',
        status: 500
      };
      spyOn(formPlayerApiService, 'getInviteServiceData').and.returnValue(throwError(errorResponse));
      spyOn<any>(service, 'sendDataError').and.callThrough();
      service.getInviteOrderData(orderId);
      expect(service.sendDataError).toHaveBeenCalledWith(errorResponse);
    });

    it('should call updateLoading with false param when call getInviteOrderData', () => {
      spyOn(formPlayerApiService, 'getInviteServiceData').and.returnValue(of(response));
      spyOn<any>(service, 'getInviteOrderData').and.callThrough();
      service.getInviteOrderData(orderId);
      expect(service['getInviteOrderData']).toHaveBeenCalled();
    });
  });

  describe('getOrderData()',() => {
    it('should call getServiceData of formPlayerApiService when call getOrderData', () => {
      spyOn(formPlayerApiService, 'getServiceData').and.callThrough();
      service.getOrderData(orderId);
      expect(formPlayerApiService.getServiceData).toHaveBeenCalled();
    });

    it('should call processResponse with response when call getOrderData with success response case', () => {
      spyOn(formPlayerApiService, 'getServiceData').and.returnValue(of(response));
      spyOn<any>(service, 'processResponse').and.callThrough();
      service.getOrderData(orderId);
      expect(service.processResponse).toHaveBeenCalledWith(response);
    });

    it('should call sendDataError with error response when call getOrderData with error response case', () => {
      const errorResponse = {
        message: 'oops... i did it again',
        description: 'a-e-e-e-e-e...',
        status: 500
      };
      spyOn(formPlayerApiService, 'getServiceData').and.returnValue(throwError(errorResponse));
      spyOn<any>(service, 'sendDataError').and.callThrough();
      service.getOrderData(orderId);
      expect(service.sendDataError).toHaveBeenCalledWith(errorResponse);
    });

    it('should call updateLoading with false param when call getOrderData', () => {
      spyOn(formPlayerApiService, 'getServiceData').and.returnValue(of(response));
      spyOn<any>(service, 'getOrderData').and.callThrough();
      service.getOrderData(orderId);
      expect(service['getOrderData']).toHaveBeenCalled();
    });
  });

  describe('navigate()',() => {

    it('should call updateLoading with false true', () => {
      spyOn<any>(service, 'updateLoading').and.callThrough();
      service.navigate({}, FormPlayerNavigation.NEXT);
      expect(service['updateLoading']).toHaveBeenCalled();
    });

    it('should call updateRequest with navigation param', () => {
      const navigation = {};
      spyOn<any>(service, 'updateRequest').and.callThrough();
      service.navigate(navigation, FormPlayerNavigation.NEXT);
      expect(service['updateRequest']).toHaveBeenCalledWith(navigation);
    });

    it('should call navigate of formPlayerApiService with params when call navigate', () => {
      const navigation = {};
      spyOn(formPlayerApiService, 'navigate').and.callThrough();
      service.navigate(navigation, FormPlayerNavigation.NEXT);
      expect(formPlayerApiService.navigate).toHaveBeenCalled();
    });

    it('should call processResponse with response when call navigate with success response case', () => {
      const navigation = {};
      spyOn(formPlayerApiService, 'navigate').and.returnValue(of(response));
      spyOn<any>(service, 'processResponse').and.callThrough();
      service.navigate(navigation, FormPlayerNavigation.NEXT);
      expect(service.processResponse).toHaveBeenCalledWith(response);
    });

    it('should call sendDataError with error response when call navigate with error response case', () => {
      const navigation = {};
      const errorResponse = {
        message: 'oops... i did it again',
        description: 'a-e-e-e-e-e...',
        status: 500
      };
      spyOn(formPlayerApiService, 'navigate').and.returnValue(throwError(errorResponse));
      spyOn<any>(service, 'sendDataError').and.callThrough();
      service.navigate(navigation, FormPlayerNavigation.NEXT);
      expect(service.sendDataError).toHaveBeenCalledWith(errorResponse);
    });

    it('should call updateLoading with false param when call navigate', () => {
      const navigation = {};
      spyOn(formPlayerApiService, 'navigate').and.returnValue(of(response));
      spyOn<any>(service, 'updateLoading').and.callThrough();
      service.navigate(navigation, FormPlayerNavigation.NEXT);
      expect(service['updateLoading']).toHaveBeenCalled();
    });
  });



  describe('processResponse()',() => {
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

    it('should call resetViewByChangeScreen with response param when hasError return false', () => {
      spyOn<any>(service, 'hasError').and.returnValue(false);
      spyOn<any>(service, 'resetViewByChangeScreen').and.callThrough();
      service.processResponse(response);
      expect(service['resetViewByChangeScreen']).toHaveBeenCalled();
    });
  });

  describe('resetViewByChangeScreen()',() => {
    it('should call scroll method of window  with (0, 0) params', () => {
      const window = TestBed.inject(WINDOW);
      spyOn<any>(window, 'scroll').and.callThrough();
      service['resetViewByChangeScreen']();
      expect(window['scroll']).toHaveBeenCalledWith(0, 0);
    });
  });

  describe('hasError()',() => {
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

  describe('hasRequestErrors()',() => {
    it('should return true if response have badRequest status', () => {
      const errorResponse = {
        description: 'oooh some error here',
        message: 'oooh some error here',
        status: FormPlayerApiErrorStatuses.badRequest
      };
      const hasRequestErrors = service['hasRequestErrors'](errorResponse);
      expect(hasRequestErrors).toBeTruthy();
    });

    it('should return false if response haven\'t any error status', () => {
      const hasRequestErrors = service['hasError'](response);
      expect(hasRequestErrors).toBeFalsy();
    });
  });

  describe('hasBusinessErrors()',() => {
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
});
