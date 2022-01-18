import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NavigationServiceStub } from '@epgu/epgu-constructor/src/lib/core/services/navigation/navigation.service.stub';
import { NavigationService } from '@epgu/epgu-constructor/src/lib/core/services/navigation/navigation.service';
import { FormPlayerApiService } from '@epgu/epgu-constructor/src/lib/form-player/services/form-player-api/form-player-api.service';
import { InitDataService } from '@epgu/epgu-constructor/src/lib/core/services/init-data/init-data.service';
import { InitDataServiceStub } from '@epgu/epgu-constructor/src/lib/core/services/init-data/init-data.service.stub';
import { FormPlayerServiceStub } from '@epgu/epgu-constructor/src/lib/form-player/services/form-player/form-player.service.stub';
import { FormPlayerService } from '@epgu/epgu-constructor/src/lib/form-player/services/form-player/form-player.service';
import { ScreenService } from '@epgu/epgu-constructor/src/lib/screen/screen.service';
import { ScreenServiceStub } from '@epgu/epgu-constructor/src/lib/screen/screen.service.stub';

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

describe('DisplayProjectListInterceptor', () => {
  let modalService: ModalService;
  let formPlayerApi: FormPlayerApiService;
  let config: ConfigService;
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
    modalService = TestBed.inject(ModalService);
    formPlayerApi = TestBed.inject(FormPlayerApiService);
    config = TestBed.inject(ConfigService);
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
