import { fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {
  AUTH_ERROR_MODAL_PARAMS,
  BOOKING_ONLINE_ERROR,
} from '@epgu/epgu-constructor/src/lib/core/services/error-handler/error-handler';
import { NavigationServiceStub } from '@epgu/epgu-constructor/src/lib/core/services/navigation/navigation.service.stub';
import { NavigationService } from '@epgu/epgu-constructor/src/lib/core/services/navigation/navigation.service';
import { FormPlayerApiService } from '@epgu/epgu-constructor/src/lib/form-player/services/form-player-api/form-player-api.service';
import { InitDataService } from '@epgu/epgu-constructor/src/lib/core/services/init-data/init-data.service';
import { InitDataServiceStub } from '@epgu/epgu-constructor/src/lib/core/services/init-data/init-data.service.stub';
import { DOUBLE_ORDER_ERROR_DISPLAY } from '@epgu/epgu-constructor/src/lib/core/display-presets/409-error';
import { FormPlayerServiceStub } from '@epgu/epgu-constructor/src/lib/form-player/services/form-player/form-player.service.stub';
import { ErrorHandlerService } from '@epgu/epgu-constructor/src/lib/core/services/error-handler/error-handler.service';
import { FormPlayerApiSuccessResponse, FormPlayerNavigation } from '@epgu/epgu-constructor-types';
import { ConfirmationModalComponent } from '@epgu/epgu-constructor/src/lib/modal/confirmation-modal/confirmation-modal.component';
import { FormPlayerService } from '@epgu/epgu-constructor/src/lib/form-player/services/form-player/form-player.service';
import { DictionaryToolsService } from '@epgu/epgu-constructor/src/lib/shared/services/dictionary/dictionary-tools.service';
import { DictionaryToolsServiceStub } from '@epgu/epgu-constructor/src/lib/shared/services/dictionary/dictionary-tools.service.stub';
import { ScreenService } from '@epgu/epgu-constructor/src/lib/screen/screen.service';
import { ScreenServiceStub } from '@epgu/epgu-constructor/src/lib/screen/screen.service.stub';
import { ModalService } from '../../../modal/modal.service';
import { ConfigService } from '../../services/config/config.service';
import { ModalServiceStub } from '../../../modal/modal.service.stub';
import { LocationServiceStub } from '../../services/location/location.service.stub';
import { ConfigServiceStub } from '../../services/config/config.service.stub';
import { LocationService } from '../../services/location/location.service';
import { ERROR_HANDLER_SERVICE } from './errors.token';
import { SessionService } from '../../services/session/session.service';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { LocalStorageServiceStub } from '../../services/local-storage/local-storage.service.stub';
import { ErrorsInterceptor } from './errors.interceptor';
import { UnsubscribeService } from '../../services/unsubscribe/unsubscribe.service';
import { InterceptorUtilsService } from '@epgu/epgu-constructor/src/lib/core/services/interceptor-utils/interceptor-utils.service';
import { MockProvider } from 'ng-mocks';
import { ContinueOrderModalService } from 'projects/epgu-constructor/src/lib/modal/continue-order-modal/continue-order-modal.service';

const responseDto = new FormPlayerServiceStub()._store;

describe('ErrorsInterceptor', () => {
  let modalService: ModalService;
  let navigationService: NavigationService;
  let formPlayerApi: FormPlayerApiService;
  let config: ConfigService;
  let init: InitDataService;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  const serviceId = 'local';
  const orderId = 12345;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        FormPlayerApiService,
        SessionService,
        ErrorHandlerService,
        InterceptorUtilsService,
        UnsubscribeService,
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
        MockProvider(LocalStorageService),
        MockProvider(FormPlayerService),
        MockProvider(ContinueOrderModalService),
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
    const spy = jest.spyOn(modalService, 'openModal');
    formPlayerApi.checkIfOrderExist().subscribe((response) => {
      expect(response).toBeTruthy();
    });
    const requestToSucceed = httpMock.expectOne(
      `${config.apiUrl}/service/${init.serviceId}/scenario/checkIfOrderIdExists`,
    );
    requestToSucceed.flush({});
    expect(spy).toHaveBeenCalledTimes(0);
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
    const spy = jest.spyOn(modalService, 'openModal');
    formPlayerApi.getBooking().subscribe();
    const req = httpMock.expectOne(`${config.apiUrl}/service/booking`);
    expect(req.request.method).toBe('POST');

    req.flush(data);
    expect(spy).toHaveBeenCalledWith(ConfirmationModalComponent, BOOKING_ONLINE_ERROR);
    tick();
  }));

  it('should open modal with AUTH_ERROR_MODAL_PARAMS params', fakeAsync(() => {
    const spy = jest.spyOn(modalService, 'openModal');
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
    expect(spy).toHaveBeenCalledWith(ConfirmationModalComponent, AUTH_ERROR_MODAL_PARAMS);
    tick();
  }));

  it('should switch screen to double order display error when get 409 status code on getNextStep request', fakeAsync(() => {
    const spy = jest.spyOn(navigationService, 'patchOnCli');
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
    expect(spy).toHaveBeenCalledWith({
      display: DOUBLE_ORDER_ERROR_DISPLAY,
      errors: {
        description: 'Заявление уже было подано',
        name: 'Conflict',
      },
    });
    tick();
  }));

  it('should switch screen to expire order display error when get 410 status code on getOrderStatus request', fakeAsync(() => {
    const testOrderId = '42';
    formPlayerApi.getOrderStatus(Number(testOrderId)).subscribe(
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
    tick();
  }));
});
