import { fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { ErrorsInterceptor } from './errors.interceptor';
import {
  AUTH_ERROR_MODAL_PARAMS,
  DRAFT_STATEMENT_NOT_FOUND,
  ORDER_NOT_FOUND_ERROR_MODAL_PARAMS,
  BOOKING_ONLINE_ERROR,
  TIME_INVITATION_ERROR,
  NO_RIGHTS_FOR_SENDING_APPLICATION_ERROR,
} from '@epgu/epgu-constructor/src/lib/core/services/error-handler/error-handler';
import { NavigationServiceStub } from '@epgu/epgu-constructor/src/lib/core/services/navigation/navigation.service.stub';
import { NavigationService } from '@epgu/epgu-constructor/src/lib/core/services/navigation/navigation.service';
import { FormPlayerApiService } from '@epgu/epgu-constructor/src/lib/form-player/services/form-player-api/form-player-api.service';
import { InitDataService } from '@epgu/epgu-constructor/src/lib/core/services/init-data/init-data.service';
import { InitDataServiceStub } from '@epgu/epgu-constructor/src/lib/core/services/init-data/init-data.service.stub';
import DOUBLE_ORDER_ERROR_DISPLAY from '@epgu/epgu-constructor/src/lib/core/display-presets/409-error';
import EXPIRE_ORDER_ERROR_DISPLAY from '@epgu/epgu-constructor/src/lib/core/display-presets/410-error';
import { FormPlayerNavigation } from '@epgu/epgu-constructor/src/lib/form-player/form-player.types';
import { FormPlayerServiceStub } from '@epgu/epgu-constructor/src/lib/form-player/services/form-player/form-player.service.stub';
import { configureTestSuite } from 'ng-bullet';
import { ErrorHandlerService } from '@epgu/epgu-constructor/src/lib/core/services/error-handler/error-handler.service';
import { FormPlayerApiSuccessResponse } from '@epgu/epgu-constructor-types';
import { ConfirmationModalComponent } from '@epgu/epgu-constructor/src/lib/modal/confirmation-modal/confirmation-modal.component';
import { ModalService } from '../../../modal/modal.service';
import { ConfigService } from '../../services/config/config.service';
import { ModalServiceStub } from '../../../modal/modal.service.stub';
import { LocationServiceStub } from '../../services/location/location.service.stub';
import { ConfigServiceStub } from '../../services/config/config.service.stub';
import { LocationService } from '../../services/location/location.service';
import { FormPlayerService } from '@epgu/epgu-constructor/src/lib/form-player/services/form-player/form-player.service';
import { ERROR_HANDLER_SERVICE } from './errors.token';
import { SessionService } from '../../services/session/session.service';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { LocalStorageServiceStub } from '../../services/local-storage/local-storage.service.stub';
import { DictionaryToolsService } from '@epgu/epgu-constructor/src/lib/shared/services/dictionary/dictionary-tools.service';
import { DictionaryToolsServiceStub } from '@epgu/epgu-constructor/src/lib/shared/services/dictionary/dictionary-tools.service.stub';
import { ScreenService } from '@epgu/epgu-constructor/src/lib/screen/screen.service';
import { ScreenServiceStub } from '@epgu/epgu-constructor/src/lib/screen/screen.service.stub';

const responseDto = new FormPlayerServiceStub()._store;

describe('ErrorsInterceptor', () => {
  let modalService: ModalService;
  let navigationService: NavigationService;
  let formPlayerApi: FormPlayerApiService;
  let config: ConfigService;
  let init: InitDataService;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  let serviceId = 'local';
  let orderId = 12345;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        FormPlayerApiService,
        SessionService,
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: LocationService, useClass: LocationServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: FormPlayerService, useClass: FormPlayerServiceStub },
        { provide: NavigationService, useClass: NavigationServiceStub },
        { provide: InitDataService, useClass: InitDataServiceStub },
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
        { provide: DictionaryToolsService, useClass: DictionaryToolsServiceStub },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ErrorsInterceptor,
          multi: true,
        },
        {
          provide: ERROR_HANDLER_SERVICE,
          useClass: ErrorHandlerService,
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
    httpClient = TestBed.inject(HttpClient);
  });

  it('should not call open modal', fakeAsync(() => {
    spyOn(modalService, 'openModal').and.callThrough();
    formPlayerApi.checkIfOrderExist().subscribe((response) => {
      expect(response).toBeTruthy();
    });
    const requestToSucceed = httpMock.expectOne(
      `${config.apiUrl}/service/${init.serviceId}/scenario/checkIfOrderIdExists`,
    );
    requestToSucceed.flush({});
    expect(modalService.openModal).toHaveBeenCalledTimes(0);
    tick();
  }));

  it('should open modal with AUTH_ERROR_MODAL_PARAMS params', fakeAsync(() => {
    spyOn(modalService, 'openModal').and.callThrough();
    formPlayerApi.checkIfOrderExist().subscribe(
      () => fail('should have failed with the 401 error'),
      (error: HttpErrorResponse) => {
        expect(error.status).toEqual(401);
      },
    );
    const requestToError = httpMock.expectOne(
      `${config.apiUrl}/service/${init.serviceId}/scenario/checkIfOrderIdExists`,
    );
    const body = new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' });
    requestToError.flush('Unauthorized', body);
    expect(modalService.openModal).toHaveBeenCalledWith(
      ConfirmationModalComponent,
      AUTH_ERROR_MODAL_PARAMS,
    );
    tick();
  }));

  it('should open modal with NO_RIGHTS_FOR_SENDING_APPLICATION_ERROR params', fakeAsync(() => {
    spyOn(modalService, 'openModal').and.callThrough();
    formPlayerApi.checkIfOrderExist().subscribe(
      () => fail('should have failed with the 403 error'),
      (error: HttpErrorResponse) => {
        expect(error.status).toEqual(403);
      },
    );
    const requestToError = httpMock.expectOne(
      `${config.apiUrl}/service/${init.serviceId}/scenario/checkIfOrderIdExists`,
    );
    const body = new HttpErrorResponse({ status: 403 });
    requestToError.flush({ status: 'NO_RIGHTS_FOR_SENDING_APPLICATION' }, body);
    expect(modalService.openModal).toHaveBeenCalledWith(
      ConfirmationModalComponent,
      NO_RIGHTS_FOR_SENDING_APPLICATION_ERROR,
    );
    tick();
  }));

  it('should open modal with BOOKING_ONLINE_ERROR params', fakeAsync(() => {
    const data = {
      scenarioDto: {
        display: {
          components: [
            {
              value:
                '{"ADDRESS": "TEST_ADDRESS", "organizationID": "BOOKING_UNAVAILABLE_EMPTY_ORG_ID"}',
            },
          ],
        },
      },
    } as FormPlayerApiSuccessResponse;
    spyOn(modalService, 'openModal').and.callThrough();
    formPlayerApi.getBooking().subscribe();
    const req = httpMock.expectOne(`${config.apiUrl}/service/booking`);
    expect(req.request.method).toBe('POST');

    req.flush(data);
    expect(modalService.openModal).toHaveBeenCalledWith(
      ConfirmationModalComponent,
      BOOKING_ONLINE_ERROR,
    );
    tick();
  }));

  it('should open modal with DRAFT_STATEMENT_NOT_FOUND params', fakeAsync(() => {
    spyOn(modalService, 'openModal').and.callThrough();
    formPlayerApi.checkIfOrderExist().subscribe(
      () => fail('should have failed with the 406 error'),
      (error: HttpErrorResponse) => {
        expect(error.status).toEqual(406);
      },
    );
    const requestToError = httpMock.expectOne(
      `${config.apiUrl}/service/${init.serviceId}/scenario/checkIfOrderIdExists`,
    );
    const body = new HttpErrorResponse({
      status: 406,
      statusText: 'Not Acceptable',
    });
    requestToError.flush(
      {
        name: 'Not Acceptable',
        description: 'Заявление не совместимо с услугой',
      },
      body,
    );
    expect(modalService.openModal).toHaveBeenCalledWith(
      ConfirmationModalComponent,
      DRAFT_STATEMENT_NOT_FOUND,
    );
    tick();
  }));

  it('should open modal with ORDER_NOT_FOUND_ERROR_MODAL_PARAMS params', fakeAsync(() => {
    spyOn(modalService, 'openModal').and.callThrough();
    formPlayerApi.getOrderStatus(init.orderId).subscribe(
      () => fail('should have failed with the 404 error'),
      (error: HttpErrorResponse) => {
        expect(error.status).toEqual(404);
      },
    );
    const requestToError = httpMock.expectOne(
      `${config.apiUrl}/service/${serviceId}/scenario/getOrderStatus`,
    );
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
    formPlayerApi.navigate(responseDto, {}, FormPlayerNavigation.NEXT).subscribe(
      () => fail('should have failed with the 409 error'),
      (error: HttpErrorResponse) => {
        expect(error.status).toEqual(409);
      },
    );
    const requestToError = httpMock.expectOne(
      `${config.apiUrl}/service/${init.serviceId}/scenario/getNextStep`,
    );
    const body = new HttpErrorResponse({
      status: 409,
      statusText: 'Conflict',
      url: `${config.apiUrl}/service/${init.serviceId}/scenario/getNextStep`,
    });
    requestToError.flush(
      {
        name: 'Conflict',
        description: 'Заявление уже было подано',
      },
      body,
    );
    expect(navigationService.patchOnCli).toHaveBeenCalledWith({
      display: DOUBLE_ORDER_ERROR_DISPLAY,
    });
    tick();
  }));

  it('should switch screen to expire order display error when get 410 status code on getOrderStatus request', fakeAsync(() => {
    spyOn(navigationService, 'patchOnCli').and.callThrough();
    const orderId = '42';
    formPlayerApi.getOrderStatus(Number(orderId)).subscribe(
      () => fail('should have failed with the 410 error'),
      (error: HttpErrorResponse) => {
        expect(error.status).toEqual(410);
      },
    );
    const requestToError = httpMock.expectOne(
      `${config.apiUrl}/service/${init.serviceId}/scenario/getOrderStatus`,
    );
    const body = new HttpErrorResponse({
      status: 410,
      statusText: 'Gone',
    });
    requestToError.flush(
      {
        name: 'Gone',
        description: 'Ссылка уже не актуальна',
      },
      body,
    );
    expect(navigationService.patchOnCli).toHaveBeenCalledWith({
      display: EXPIRE_ORDER_ERROR_DISPLAY,
    });
    tick();
  }));

  it('should open modal with TIME_INVITATION_ERROR', fakeAsync(() => {
    const url = 'lk/v1/orders/1155289257/invitations/inviteToSign/send';
    const spy = jest.spyOn(modalService, 'openModal');
    httpClient
      .get(url)
      .pipe(catchError(() => of()))
      .subscribe();
    const req = httpMock.expectOne(url);
    req.error(new ErrorEvent('error'), { status: 408 });
    expect(spy).toHaveBeenCalledWith(ConfirmationModalComponent, TIME_INVITATION_ERROR);
    tick();
  }));
});
