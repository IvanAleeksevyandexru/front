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
import { DictionaryLoadingTimeoutInterceptor } from './dictionary-loading-timeout.interceptor';
import { SMEV2_SERVICE_OR_SPEC_SESSION_TIMEOUT2 } from '../../services/error-handler/error-handler.inteface';
import { InterceptorUtilsService } from '../../services/interceptor-utils/interceptor-utils.service';
import { FormPlayerApiService } from '../../../form-player/services/form-player-api/form-player-api.service';
import { FormPlayerService } from '../../../form-player/services/form-player/form-player.service';
import { FormPlayerServiceStub } from '../../../form-player/services/form-player/form-player.service.stub';
import { ConfirmationModalComponent } from '../../../modal/confirmation-modal/confirmation-modal.component';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { SERVICE_OR_SPEC_SESSION_TIMEOUT } from '../../services/error-handler/error-handler';
import { InitDataService } from '../../services/init-data/init-data.service';
import { InitDataServiceStub } from '../../services/init-data/init-data.service.stub';
import { NavigationService } from '../../services/navigation/navigation.service';
import { NavigationServiceStub } from '../../services/navigation/navigation.service.stub';

const data = {
  error: {
    message: SMEV2_SERVICE_OR_SPEC_SESSION_TIMEOUT2,
  },
};

describe('DictionaryLoadingTimeoutInterceptor', () => {
  let modalService: ModalService;
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
          useClass: DictionaryLoadingTimeoutInterceptor,
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

  it('should open modal with dictionary/mzrf_lpu_equeue_smev3', () => {
    const spy = jest.spyOn(modalService, 'openModal');
    httpClient.get('/dictionary/mzrf_lpu_equeue_smev3').subscribe();
    const req = httpMock.expectOne(`/dictionary/mzrf_lpu_equeue_smev3`);

    req.flush(data);

    expect(req.request.context.get(IS_REQUEST_USED)).toBeTruthy();
    expect(spy).toHaveBeenCalledWith(ConfirmationModalComponent, SERVICE_OR_SPEC_SESSION_TIMEOUT);
  });

  it('should open modal with dictionary/mzrf_equeue_lpu', () => {
    const spy = jest.spyOn(modalService, 'openModal');
    httpClient.get('/dictionary/mzrf_equeue_lpu').subscribe();
    const req = httpMock.expectOne(`/dictionary/mzrf_equeue_lpu`);

    req.flush(data);

    expect(req.request.context.get(IS_REQUEST_USED)).toBeTruthy();
    expect(spy).toHaveBeenCalledWith(ConfirmationModalComponent, SERVICE_OR_SPEC_SESSION_TIMEOUT);
  });

  it('should open modal with dictionary/mzrf_lpu_vaccination', () => {
    const spy = jest.spyOn(modalService, 'openModal');
    httpClient.get('/dictionary/mzrf_lpu_vaccination').subscribe();
    const req = httpMock.expectOne(`/dictionary/mzrf_lpu_vaccination`);

    req.flush(data);

    expect(req.request.context.get(IS_REQUEST_USED)).toBeTruthy();
    expect(spy).toHaveBeenCalledWith(ConfirmationModalComponent, SERVICE_OR_SPEC_SESSION_TIMEOUT);
  });
});
