import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
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
import { RefResourceInterceptor } from './ref-resource.interceptor';
import {
  NO_AVAILABLE_DATA,
  RefName,
  SMEV2_SERVICE_OR_SPEC_SESSION_TIMEOUT2,
  SMEV3_SERVICE_OR_SPEC_NO_AVAILABLE,
} from '../../services/error-handler/error-handler.inteface';
import { ConfirmationModal } from '@epgu/epgu-constructor-types';
import { InterceptorUtilsService } from '../../services/interceptor-utils/interceptor-utils.service';
import { FormPlayerApiService } from '../../../form-player/services/form-player-api/form-player-api.service';
import { FormPlayerService } from '../../../form-player/services/form-player/form-player.service';
import { FormPlayerServiceStub } from '../../../form-player/services/form-player/form-player.service.stub';
import { ConfirmationModalComponent } from '../../../modal/confirmation-modal/confirmation-modal.component';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import {
  SERVICE_OR_SPEC_SESSION_TIMEOUT_2,
  RESOURCE_NOT_AVAILABLE,
  NO_DOCTORS,
  LOADING_ERROR_MODAL_PARAMS,
} from '../../services/error-handler/error-handler';
import { InitDataService } from '../../services/init-data/init-data.service';
import { InitDataServiceStub } from '../../services/init-data/init-data.service.stub';
import { NavigationService } from '../../services/navigation/navigation.service';
import { NavigationServiceStub } from '../../services/navigation/navigation.service.stub';

describe('RefResourceInterceptor', () => {
  let modalService: ModalService;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let screenService: ScreenService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        FormPlayerApiService,
        SessionService,
        InterceptorUtilsService,
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: LocationService, useClass: LocationServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: FormPlayerService, useClass: FormPlayerServiceStub },
        { provide: NavigationService, useClass: NavigationServiceStub },
        { provide: InitDataService, useClass: InitDataServiceStub },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: RefResourceInterceptor,
          multi: true,
        },
      ],
    });
  });

  beforeEach(() => {
    modalService = TestBed.inject(ModalService);
    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    screenService = TestBed.inject(ScreenService);
  });

  it('should open modal with SMEV2_SERVICE_OR_SPEC_SESSION_TIMEOUT2', () => {
    const spy = jest.spyOn(modalService, 'openModal');
    httpClient.post('/ref/items', { refName: RefName.resource }).subscribe();
    const req = httpMock.expectOne(`/ref/items`);

    const data = {
      error: {
        errorDetail: {
          errorMessage: SMEV2_SERVICE_OR_SPEC_SESSION_TIMEOUT2,
        },
      },
    };

    req.flush(data);
    SERVICE_OR_SPEC_SESSION_TIMEOUT_2.buttons = [
      {
        label: 'Начать заново',
        closeModal: true,
        value: 'init',
      },
    ];
    expect(req.request.context.get(IS_REQUEST_USED)).toBeTruthy();
    expect(spy).toHaveBeenCalledWith(ConfirmationModalComponent, SERVICE_OR_SPEC_SESSION_TIMEOUT_2);
  });

  it('should open modal with SMEV3_SERVICE_OR_SPEC_NO_AVAILABLE', () => {
    const spy = jest.spyOn(modalService, 'openModal');
    httpClient.post('/ref/items', { refName: RefName.resource }).subscribe();
    const req = httpMock.expectOne(`/ref/items`);

    const data = {
      error: {
        errorDetail: {
          errorMessage: SMEV3_SERVICE_OR_SPEC_NO_AVAILABLE,
        },
      },
    };

    req.flush(data);
    const modalParams = {
      ...RESOURCE_NOT_AVAILABLE,
      buttons: [
        {
          label: 'Начать заново',
          color: 'white',
          closeModal: true,
          value: 'init',
        },
        {
          label: 'Попробовать ещё раз',
          closeModal: true,
          value: 'prevStep',
        },
      ],
    } as ConfirmationModal;
    expect(req.request.context.get(IS_REQUEST_USED)).toBeTruthy();
    expect(spy).toHaveBeenCalledWith(ConfirmationModalComponent, modalParams);
  });

  it('should open modal with NO_AVAILABLE_DATA', () => {
    const spy = jest.spyOn(modalService, 'openModal');
    httpClient.post('/ref/items', { refName: RefName.resource }).subscribe();
    const req = httpMock.expectOne(`/ref/items`);

    const data = {
      error: {
        errorDetail: {
          errorMessage: NO_AVAILABLE_DATA,
        },
      },
    };

    req.flush(data);
    expect(req.request.context.get(IS_REQUEST_USED)).toBeTruthy();
    expect(spy).toHaveBeenCalledWith(ConfirmationModalComponent, NO_DOCTORS);
  });

  it('should open modal with type != TimeSlotDoctor', () => {
    const spy = jest.spyOn(modalService, 'openModal');
    httpClient.post('/ref/items', { refName: RefName.resource }).subscribe();
    const req = httpMock.expectOne(`/ref/items`);

    const data = {
      error: {
        errorDetail: {
          errorMessage: '123',
        },
      },
    };

    req.flush(data);
    expect(req.request.context.get(IS_REQUEST_USED)).toBeTruthy();

    const modalParams = {
      ...LOADING_ERROR_MODAL_PARAMS,
      buttons: [
        {
          label: 'Начать заново',
          color: 'white',
          closeModal: true,
          value: 'init',
        },
        {
          label: 'Попробовать ещё раз',
          closeModal: true,
          value: 'prevStep',
        },
      ],
    };
    const message = data.error.errorDetail.errorMessage
      .replace('FAILURE:', '')
      .replace('UNKNOWN_REQUEST_DESCRIPTION:', '')
      .replace('NO_DATA:', '');
    modalParams.text = modalParams.text.replace(/\{textAsset\}?/g, message);

    expect(spy).toHaveBeenCalledWith(ConfirmationModalComponent, modalParams);
  });

  it('should not open modal with type == TimeSlotDoctor', () => {
    const spy = jest.spyOn(modalService, 'openModal');
    jest.spyOn(screenService, 'getStore').mockReturnValue({
      display: {
        components: [{ type: 'TimeSlotDoctor' }],
      },
    } as unknown);
    httpClient.post('/ref/items', { refName: RefName.resource }).subscribe();
    const req = httpMock.expectOne(`/ref/items`);

    const data = {
      error: {
        errorDetail: {
          errorMessage: '123',
        },
      },
    };

    req.flush(data);
    expect(req.request.context.get(IS_REQUEST_USED)).toBeTruthy();

    expect(spy).not.toHaveBeenCalled();
  });
});
