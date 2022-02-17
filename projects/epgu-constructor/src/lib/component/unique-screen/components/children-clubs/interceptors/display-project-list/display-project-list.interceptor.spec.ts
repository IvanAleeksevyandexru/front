import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {
  ConfigService,
  ConfigServiceStub,
  IS_REQUEST_USED,
  LocationService,
  LocationServiceStub,
  MicroAppNavigationService,
  MicroAppNavigationServiceStub,
  ModalService,
  ModalServiceStub,
  SessionService,
} from '@epgu/epgu-constructor-ui-kit';
import { DisplayProjectListInterceptor } from './display-project-list.interceptor';
import { PROGRAM_DETAIL_SUB_URL, SEARCH_GROUP_SUB_URL } from '../../services/health/health-handler';
import { InitDataService } from '../../../../../../core/services/init-data/init-data.service';
import { InitDataServiceStub } from '../../../../../../core/services/init-data/init-data.service.stub';
import { NavigationService } from '../../../../../../core/services/navigation/navigation.service';
import { NavigationServiceStub } from '../../../../../../core/services/navigation/navigation.service.stub';
import { FormPlayerApiService } from '../../../../../../form-player/services/form-player-api/form-player-api.service';
import { FormPlayerService } from '../../../../../../form-player/services/form-player/form-player.service';
import { FormPlayerServiceStub } from '../../../../../../form-player/services/form-player/form-player.service.stub';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';

describe('DisplayProjectListInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let navService: MicroAppNavigationService;
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
        { provide: MicroAppNavigationService, useClass: MicroAppNavigationServiceStub },
        { provide: InitDataService, useClass: InitDataServiceStub },
        { provide: NavigationService, useClass: NavigationServiceStub },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: DisplayProjectListInterceptor,
          multi: true,
        },
      ],
    });
  });

  beforeEach(() => {
    navService = TestBed.inject(MicroAppNavigationService);
    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });
  it('should return to projectList display with SEARCH_GROUP_SUB_URL', () => {
    const spy = jest.spyOn(navService, 'toDisplay');
    httpMock.match((v) => {
      console.log(v);
      return true;
    });
    httpClient.get(SEARCH_GROUP_SUB_URL).subscribe();

    const req = httpMock.expectOne(SEARCH_GROUP_SUB_URL);

    req.flush({}, { status: 401, statusText: '' });

    expect(req.request.context.get(IS_REQUEST_USED)).toBeTruthy();
    expect(spy).toHaveBeenCalledWith('projectList');
  });
  it('should return to projectList display with PROGRAM_DETAIL_SUB_URL', () => {
    const spy = jest.spyOn(navService, 'toDisplay');
    httpMock.match((v) => {
      console.log(v);
      return true;
    });
    httpClient.get(PROGRAM_DETAIL_SUB_URL).subscribe();

    const req = httpMock.expectOne(PROGRAM_DETAIL_SUB_URL);

    req.flush({}, { status: 401, statusText: '' });

    expect(req.request.context.get(IS_REQUEST_USED)).toBeTruthy();
    expect(spy).toHaveBeenCalledWith('projectList');
  });
});
