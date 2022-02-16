import { TestBed, waitForAsync } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
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
import { BaseInterceptor } from './base.interceptor';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { FormPlayerApiService } from '../../../form-player/services/form-player-api/form-player-api.service';
import { FormPlayerService } from '../../../form-player/services/form-player/form-player.service';
import { FormPlayerServiceStub } from '../../../form-player/services/form-player/form-player.service.stub';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { InitDataService } from '../../services/init-data/init-data.service';
import { InitDataServiceStub } from '../../services/init-data/init-data.service.stub';
import { NavigationService } from '../../services/navigation/navigation.service';
import { NavigationServiceStub } from '../../services/navigation/navigation.service.stub';

@Injectable()
class TestInterceptor extends BaseInterceptor {
  // eslint-disable-next-line no-empty-function
  handle(request: HttpRequest<unknown>, response: HttpResponse<unknown>): void {}

  validate(_, request: HttpRequest<unknown>): boolean {
    return request.url.includes('test');
  }

  protected checkStatus(status: number): boolean {
    return status === 200 || status === 304;
  }
}

describe('BaseInterceptor', () => {
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
          useClass: TestInterceptor,
          multi: true,
        },
      ],
    });
  });

  afterEach(waitForAsync(() => httpMock.verify()));

  beforeEach(() => {
    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be test validate ok', () => {
    httpClient.get('/test').subscribe();

    const req = httpMock.expectOne(`/test`);
    req.flush({});
    expect(req.request.context.get(IS_REQUEST_USED)).toBeTruthy();
  });
  it('should be test validate ok for 304 status', () => {
    httpClient
      .get('/test')
      .pipe(catchError(() => of(null)))
      .subscribe();

    const req = httpMock.expectOne(`/test`);
    req.flush({}, { status: 304, statusText: '' });
    expect(req.request.context.get(IS_REQUEST_USED)).toBeTruthy();
  });
  it('should be test validate not ok', () => {
    httpClient.get('/tes').subscribe();

    const req = httpMock.expectOne(`/tes`);
    req.flush({});
    expect(req.request.context.get(IS_REQUEST_USED)).toBeFalsy();
  });

  it('should be test validate not ok for status not 200', () => {
    httpClient
      .get('/test')
      .pipe(catchError(() => of(null)))
      .subscribe();

    const req = httpMock.expectOne(`/test`);
    req.flush({}, { status: 400, statusText: 'test' });
    expect(req.request.context.get(IS_REQUEST_USED)).toBeFalsy();
  });
});
