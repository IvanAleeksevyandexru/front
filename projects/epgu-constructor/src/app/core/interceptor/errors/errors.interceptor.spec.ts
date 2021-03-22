import { fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ErrorsInterceptorService } from './errors.interceptor';
import { ModalService } from '../../../modal/modal.service';
import { ModalServiceStub } from '../../../modal/modal.service.stub';

import { ConfirmationModalComponent } from '../../../modal/confirmation-modal/confirmation-modal.component';
import {
  AUTH_ERROR_MODAL_PARAMS,
  DRAFT_STATEMENT_NOT_FOUND,
  COMMON_ERROR_MODAL_PARAMS,
  ORDER_NOT_FOUND_ERROR_MODAL_PARAMS,
} from './errors.interceptor.constants';
import { LocationService } from '../../services/location/location.service';
import { LocationServiceStub } from '../../services/location/location.service.stub';
import { ConfigService } from '../../services/config/config.service';
import { ConfigServiceStub } from '../../services/config/config.service.stub';
import { NavigationServiceStub } from '../../services/navigation/navigation.service.stub';
import { NavigationService } from '../../services/navigation/navigation.service';
import { FormPlayerApiService } from '../../../form-player/services/form-player-api/form-player-api.service';
import { InitDataService } from '../../services/init-data/init-data.service';
import { InitDataServiceStub } from '../../services/init-data/init-data.service.stub';
import DOUBLE_ORDER_ERROR_DISPLAY from '../../display-presets/409-error';
import EXPIRE_ORDER_ERROR_DISPLAY from '../../display-presets/410-error';
import { FormPlayerNavigation } from '../../../form-player/form-player.types';
import { FormPlayerServiceStub } from '../../../form-player/services/form-player/form-player.service.stub';

const responseDto = new FormPlayerServiceStub()._store;

describe('ErrorsInterceptor', () => {
  let modalService: ModalService;
  let navigationService: NavigationService;
  let formPlayerApi: FormPlayerApiService;
  let config: ConfigService;
  let init: InitDataService;
  let httpMock: HttpTestingController;

  let serviceId = 'local';
  let orderId = 12345;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        FormPlayerApiService,
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: LocationService, useClass: LocationServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: NavigationService, useClass: NavigationServiceStub },
        { provide: InitDataService, useClass: InitDataServiceStub },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ErrorsInterceptorService,
          multi: true,
        },
      ],
    });
  });

  afterEach(waitForAsync(() => httpMock.verify()));

  beforeEach(() => {
    modalService = TestBed.inject(ModalService);
    navigationService = TestBed.inject(NavigationService);
    formPlayerApi = TestBed.inject(FormPlayerApiService);
    config = TestBed.inject(ConfigService);
    init = TestBed.inject(InitDataService);
    init.serviceId = serviceId;
    init.orderId = orderId;
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should not call open modal', fakeAsync(() => {
    spyOn(modalService, 'openModal').and.callThrough();
    formPlayerApi.checkIfOrderExist().subscribe(response => {
      expect(response).toBeTruthy();
    });
    const requestToSucceed = httpMock.expectOne(`${config.apiUrl}/service/${init.serviceId}/scenario/checkIfOrderIdExists`);
    requestToSucceed.flush({});
    expect(modalService.openModal).toHaveBeenCalledTimes(0);
    tick();
  }));

  it('should open modal with AUTH_ERROR_MODAL_PARAMS params', fakeAsync(() => {
    spyOn(modalService, 'openModal').and.callThrough();
    formPlayerApi.checkIfOrderExist().subscribe(() => fail('should have failed with the 401 error'),
      (error: HttpErrorResponse) => {
        expect(error.status).toEqual(401);
      }
    );
    const requestToError = httpMock.expectOne(`${config.apiUrl}/service/${init.serviceId}/scenario/checkIfOrderIdExists`);
    const body = new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' });
    requestToError.flush('Unauthorized', body);
    expect(modalService.openModal).toHaveBeenCalledWith(
      ConfirmationModalComponent,
      AUTH_ERROR_MODAL_PARAMS,
    );
    tick();
  }));

  it('should open modal with DRAFT_STATEMENT_NOT_FOUND params', fakeAsync(() => {
    spyOn(modalService, 'openModal').and.callThrough();
    formPlayerApi.checkIfOrderExist().subscribe(() => fail('should have failed with the 406 error'),
      (error: HttpErrorResponse) => {
        expect(error.status).toEqual(406);
      }
    );
    const requestToError = httpMock.expectOne(`${config.apiUrl}/service/${init.serviceId}/scenario/checkIfOrderIdExists`);
    const body = new HttpErrorResponse({
      status: 406,
      statusText: 'Not Acceptable',
    });
    requestToError.flush({
      name: 'Not Acceptable',
      description: 'Заявление не совместимо с услугой'
    }, body);
    expect(modalService.openModal).toHaveBeenCalledWith(
      ConfirmationModalComponent,
      DRAFT_STATEMENT_NOT_FOUND,
    );
    tick();
  }));

  it('should open modal with COMMON_ERROR_MODAL_PARAMS params', fakeAsync(() => {
    spyOn(modalService, 'openModal').and.callThrough();
    formPlayerApi.checkIfOrderExist().subscribe(() => fail('should have failed with the 405 error'),
      (error: HttpErrorResponse) => {
        expect(error.status).toEqual(405);
      }
    );
    const requestToError = httpMock.expectOne(`${config.apiUrl}/service/${init.serviceId}/scenario/checkIfOrderIdExists`);
    const body = new HttpErrorResponse({
      status: 405,
      statusText: 'Method Not Allowed',
    });
    requestToError.flush('Method Not Allowed', body);
    expect(modalService.openModal).toHaveBeenCalledWith(
      ConfirmationModalComponent,
      COMMON_ERROR_MODAL_PARAMS,
    );
    tick();
  }));

  it('should open modal with ORDER_NOT_FOUND_ERROR_MODAL_PARAMS params', fakeAsync(() => {
    spyOn(modalService, 'openModal').and.callThrough();
    formPlayerApi.getOrderStatus(init.orderId).subscribe(() => fail('should have failed with the 404 error'),
      (error: HttpErrorResponse) => {
        expect(error.status).toEqual(404);
      }
    );
    const requestToError = httpMock.expectOne(`${config.apiUrl}/service/${serviceId}/scenario/getOrderStatus`);
    const body = new HttpErrorResponse({
      status: 404,
      statusText: 'Not Found',
      url: `${config.apiUrl}/service/${serviceId}/scenario/getOrderStatus`,
    });
    requestToError.flush('Not Found', body);
    expect(modalService.openModal).toHaveBeenCalledWith(
      ConfirmationModalComponent,
      ORDER_NOT_FOUND_ERROR_MODAL_PARAMS,
    );
    tick();
  }));

  it('should switch screen to double order display error when get 409 status code on getNextStep request', fakeAsync(() => {
    spyOn(navigationService, 'patchOnCli').and.callThrough();
    formPlayerApi.navigate(responseDto, {}, FormPlayerNavigation.NEXT).subscribe(() => fail('should have failed with the 409 error'),
      (error: HttpErrorResponse) => {
        expect(error.status).toEqual(409);
      }
    );
    const requestToError = httpMock.expectOne(`${config.apiUrl}/service/${init.serviceId}/scenario/getNextStep`);
    const body = new HttpErrorResponse({
      status: 409,
      statusText: 'Conflict',
      url: `${config.apiUrl}/service/${init.serviceId}/scenario/getNextStep`,
    });
    requestToError.flush({
      name: 'Conflict',
      description: 'Заявление уже было подано'
    }, body);
    expect(navigationService.patchOnCli).toHaveBeenCalledWith({ display: DOUBLE_ORDER_ERROR_DISPLAY });
    tick();
  }));

  it('should switch screen to expire order display error when get 410 status code on getOrderStatus request', fakeAsync(() => {
    spyOn(navigationService, 'patchOnCli').and.callThrough();
    const orderId = '42';
    formPlayerApi.getOrderStatus(orderId).subscribe(() => fail('should have failed with the 410 error'),
      (error: HttpErrorResponse) => {
        expect(error.status).toEqual(410);
      }
    );
    const requestToError = httpMock.expectOne(`${config.apiUrl}/service/${init.serviceId}/scenario/getOrderStatus`);
    const body = new HttpErrorResponse({
      status: 410,
      statusText: 'Gone',
    });
    requestToError.flush({
      name: 'Gone',
      description: 'Ссылка уже не актуальна'
    }, body);
    expect(navigationService.patchOnCli).toHaveBeenCalledWith({ display: EXPIRE_ORDER_ERROR_DISPLAY });
    tick();
  }));

  it('should open modal with errorModalWindow params', fakeAsync(() => {
    jest.spyOn(modalService, 'openModal');
    formPlayerApi.navigate(responseDto, {}, FormPlayerNavigation.NEXT).subscribe(() => fail('should have failed with the 409 error'),
      (error: HttpErrorResponse) => {
        expect(error.status).toEqual(409);
      }
    );
    const requestToError = httpMock.expectOne(`${config.apiUrl}/service/${init.serviceId}/scenario/getNextStep`);
    const body = new HttpErrorResponse({
      status: 409,
      statusText: '',
      url: `${config.apiUrl}/service/${init.serviceId}/scenario/getNextStep`,
    });
    requestToError.flush({
      errorModalWindow : ORDER_NOT_FOUND_ERROR_MODAL_PARAMS
    }, body);
    expect(modalService.openModal).toHaveBeenCalledWith(
      ConfirmationModalComponent,
      ORDER_NOT_FOUND_ERROR_MODAL_PARAMS,
    );
    tick();
  }));
});
