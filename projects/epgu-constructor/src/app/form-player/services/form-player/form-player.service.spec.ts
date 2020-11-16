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
        { provide: FormPlayerApiService, useClass: FormPlayerApiServiceStub },
      ]
    });
    service = TestBed.inject(FormPlayerService);
    location = TestBed.inject(Location);
    formPlayerApiService = TestBed.inject(FormPlayerApiService);
  });

  beforeEach(() => {
    orderId = '1234';
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
});
