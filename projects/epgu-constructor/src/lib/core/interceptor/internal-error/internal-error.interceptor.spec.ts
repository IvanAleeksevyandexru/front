import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {
  INTERNAL_ERROR_MODAL,
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
import { InternalErrorInterceptor } from './internal-error.interceptor';
import {
  INTERNAL_ERROR_TEXT,
  INTERNAL_ERROR_TITLE,
} from '../../services/error-handler/error-handler.inteface';
import { InterceptorUtilsService } from '../../services/interceptor-utils/interceptor-utils.service';

const data = {
  error: {
    message: 'Internal Error',
  },
};
const configModal = {
  ...INTERNAL_ERROR_MODAL,
  text: INTERNAL_ERROR_MODAL.text
    .replace(/\{textAsset\}?/g, INTERNAL_ERROR_TEXT)
    .replace(/\{titleAsset\}?/g, INTERNAL_ERROR_TITLE),
};

describe('InternalErrorInterceptor', () => {
  let modalService: ModalService;
  let formPlayerApi: FormPlayerApiService;
  let config: ConfigService;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
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
          useClass: InternalErrorInterceptor,
          multi: true,
        },
      ],
    });
  });

  beforeEach(() => {
    modalService = TestBed.inject(ModalService);
    formPlayerApi = TestBed.inject(FormPlayerApiService);
    config = TestBed.inject(ConfigService);
    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });
  it('should open modal with  status 500', () => {
    const spy = jest.spyOn(modalService, 'openModal');
    httpClient.get('/dictionary/mzrf_regions_smev3').subscribe();

    const req = httpMock.expectOne(`/dictionary/mzrf_regions_smev3`);

    req.flush(data, { status: 500, statusText: '' });

    expect(req.request.context.get(IS_REQUEST_USED)).toBeTruthy();
    expect(spy).toHaveBeenCalledWith(ConfirmationModalComponent, configModal);
  });
  it('should open modal with dictionary/mzrf_regions_smev3', () => {
    const spy = jest.spyOn(modalService, 'openModal');
    httpClient.get('/dictionary/mzrf_regions_smev3').subscribe();

    const req = httpMock.expectOne(`/dictionary/mzrf_regions_smev3`);

    req.flush(data);

    expect(req.request.context.get(IS_REQUEST_USED)).toBeTruthy();
    expect(spy).toHaveBeenCalledWith(ConfirmationModalComponent, configModal);
  });

  it('should open modal with dictionary/mzrf_equeue_lpu', () => {
    const spy = jest.spyOn(modalService, 'openModal');
    httpClient.get('/dictionary/mzrf_equeue_lpu').subscribe();

    const req = httpMock.expectOne(`/dictionary/mzrf_equeue_lpu`);

    req.flush(data);

    expect(req.request.context.get(IS_REQUEST_USED)).toBeTruthy();
    expect(spy).toHaveBeenCalledWith(ConfirmationModalComponent, configModal);
  });

  it('should open modal with dictionary/mzrf_lpu_equeue_smev3', () => {
    const spy = jest.spyOn(modalService, 'openModal');
    httpClient.get('/dictionary/mzrf_lpu_equeue_smev3').subscribe();

    const req = httpMock.expectOne(`/dictionary/mzrf_lpu_equeue_smev3`);

    req.flush(data);

    expect(req.request.context.get(IS_REQUEST_USED)).toBeTruthy();
    expect(spy).toHaveBeenCalledWith(ConfirmationModalComponent, configModal);
  });

  it('should open modal with dictionary/mzrf_regions_vaccination', () => {
    const spy = jest.spyOn(modalService, 'openModal');
    httpClient.get('/dictionary/mzrf_regions_vaccination').subscribe();

    const req = httpMock.expectOne(`/dictionary/mzrf_regions_vaccination`);

    req.flush(data);

    expect(req.request.context.get(IS_REQUEST_USED)).toBeTruthy();
    expect(spy).toHaveBeenCalledWith(ConfirmationModalComponent, configModal);
  });

  it('should open modal with dictionary/mzrf_lpu_vaccination', () => {
    const spy = jest.spyOn(modalService, 'openModal');
    httpClient.get('/dictionary/mzrf_lpu_vaccination').subscribe();

    const req = httpMock.expectOne(`/dictionary/mzrf_lpu_vaccination`);

    req.flush(data);

    expect(req.request.context.get(IS_REQUEST_USED)).toBeTruthy();
    expect(spy).toHaveBeenCalledWith(ConfirmationModalComponent, configModal);
  });
});
