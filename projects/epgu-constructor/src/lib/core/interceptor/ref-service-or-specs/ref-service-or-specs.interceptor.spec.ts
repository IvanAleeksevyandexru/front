import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {
  LOADING_ERROR_MODAL_PARAMS,
  NO_DOCTORS,
  RESOURCE_NOT_AVAILABLE,
  SERVICE_OR_SPEC_NO_AVAILABLE,
  SERVICE_OR_SPEC_NO_SPECIALIST,
  SERVICE_OR_SPEC_SESSION_TIMEOUT,
  SERVICE_OR_SPEC_SESSION_TIMEOUT_2,
  STATIC_ERROR_MODAL,
} from '@epgu/epgu-constructor/src/lib/core/services/error-handler/error-handler';
import { NavigationServiceStub } from '@epgu/epgu-constructor/src/lib/core/services/navigation/navigation.service.stub';
import { NavigationService } from '@epgu/epgu-constructor/src/lib/core/services/navigation/navigation.service';
import { FormPlayerApiService } from '@epgu/epgu-constructor/src/lib/form-player/services/form-player-api/form-player-api.service';
import { InitDataService } from '@epgu/epgu-constructor/src/lib/core/services/init-data/init-data.service';
import { InitDataServiceStub } from '@epgu/epgu-constructor/src/lib/core/services/init-data/init-data.service.stub';
import { FormPlayerServiceStub } from '@epgu/epgu-constructor/src/lib/form-player/services/form-player/form-player.service.stub';

import { ConfirmationModalComponent } from '@epgu/epgu-constructor/src/lib/modal/confirmation-modal/confirmation-modal.component';
import { FormPlayerService } from '@epgu/epgu-constructor/src/lib/form-player/services/form-player/form-player.service';
import { ScreenService } from '@epgu/epgu-constructor/src/lib/screen/screen.service';
import { ScreenServiceStub } from '@epgu/epgu-constructor/src/lib/screen/screen.service.stub';

import {
  ConfigService,
  ConfigServiceStub,
  IS_REQUEST_USED,
  LocationService,
  LocationServiceStub,
  ModalService,
  ModalServiceStub,
  SessionService,
} from '@epgu/epgu-constructor-ui-kit';

import {
  RefName,
  SMEV2_SERVICE_OR_SPEC_NO_SPECIALIST,
  SMEV2_SERVICE_OR_SPEC_SESSION_TIMEOUT2,
  SMEV3_SERVICE_OR_SPEC_NO_AVAILABLE,
} from '../../services/error-handler/error-handler.inteface';

import { RefServiceOrSpecsInterceptor } from './ref-service-or-specs.interceptor';

describe('RefServiceOrSpecsInterceptor', () => {
  let modalService: ModalService;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  beforeEach(() => {
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
        {
          provide: HTTP_INTERCEPTORS,
          useClass: RefServiceOrSpecsInterceptor,
          multi: true,
        },
      ],
    });
  });

  beforeEach(() => {
    modalService = TestBed.inject(ModalService);
    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should open modal with SMEV2_SERVICE_OR_SPEC_NO_SPECIALIST', () => {
    const spy = jest.spyOn(modalService, 'openModal');
    httpClient.post('/ref/items', { refName: RefName.serviceOrSpecs }).subscribe();
    const req = httpMock.expectOne(`/ref/items`);

    const data = {
      error: {
        errorDetail: {
          errorMessage: SMEV2_SERVICE_OR_SPEC_NO_SPECIALIST,
          errorCode: 2,
        },
      },
    };

    req.flush(data);

    expect(req.request.context.get(IS_REQUEST_USED)).toBeTruthy();
    expect(spy).toHaveBeenCalledWith(ConfirmationModalComponent, SERVICE_OR_SPEC_NO_SPECIALIST);
  });

  it('should open modal with NO_DATA', () => {
    const spy = jest.spyOn(modalService, 'openModal');
    httpClient.post('/ref/items', { refName: RefName.serviceOrSpecs }).subscribe();
    const req = httpMock.expectOne(`/ref/items`);

    const data = {
      error: {
        errorDetail: {
          errorMessage: 'NO_DATA',
          errorCode: 2,
        },
      },
    };

    req.flush(data);

    expect(req.request.context.get(IS_REQUEST_USED)).toBeTruthy();
    expect(spy).toHaveBeenCalledWith(ConfirmationModalComponent, SERVICE_OR_SPEC_NO_SPECIALIST);
  });

  it('should open modal with SMEV3_SERVICE_OR_SPEC_NO_AVAILABLE', () => {
    const spy = jest.spyOn(modalService, 'openModal');
    httpClient.post('/ref/items', { refName: RefName.serviceOrSpecs }).subscribe();
    const req = httpMock.expectOne(`/ref/items`);

    const data = {
      error: {
        errorDetail: {
          errorMessage: SMEV3_SERVICE_OR_SPEC_NO_AVAILABLE,
          errorCode: 2,
        },
      },
    };

    req.flush(data);

    expect(req.request.context.get(IS_REQUEST_USED)).toBeTruthy();
    expect(spy).toHaveBeenCalledWith(ConfirmationModalComponent, SERVICE_OR_SPEC_NO_AVAILABLE);
  });

  it('should open modal with SMEV2_SERVICE_OR_SPEC_SESSION_TIMEOUT2', () => {
    const spy = jest.spyOn(modalService, 'openModal');
    httpClient.post('/ref/items', { refName: RefName.serviceOrSpecs }).subscribe();
    const req = httpMock.expectOne(`/ref/items`);

    const data = {
      error: {
        errorDetail: {
          errorMessage: SMEV2_SERVICE_OR_SPEC_SESSION_TIMEOUT2,
          errorCode: 2,
        },
      },
    };

    req.flush(data);

    expect(req.request.context.get(IS_REQUEST_USED)).toBeTruthy();
    expect(spy).toHaveBeenCalledWith(ConfirmationModalComponent, SERVICE_OR_SPEC_SESSION_TIMEOUT);
  });

  it('should open modal with error', () => {
    const spy = jest.spyOn(modalService, 'openModal');
    httpClient.post('/ref/items', { refName: RefName.serviceOrSpecs }).subscribe();
    const req = httpMock.expectOne(`/ref/items`);

    const data = {
      error: {
        errorDetail: {
          errorMessage: '123',
          errorCode: 0,
        },
      },
    };

    req.flush(data);
    STATIC_ERROR_MODAL.text.replace(/\{textAsset\}?/g, data.error.errorDetail.errorMessage);
    expect(req.request.context.get(IS_REQUEST_USED)).toBeTruthy();
    expect(spy).toHaveBeenCalledWith(ConfirmationModalComponent, STATIC_ERROR_MODAL);
  });
});
