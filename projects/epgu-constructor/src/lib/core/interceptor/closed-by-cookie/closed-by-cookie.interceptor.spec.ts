import { TestBed, waitForAsync } from '@angular/core/testing';

import { ClosedByCookieInterceptor } from './closed-by-cookie-interceptor';
import {
  DeviceDetectorService,
  DeviceDetectorServiceStub,
  LocationService,
  LocationServiceStub,
} from '@epgu/epgu-constructor-ui-kit';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

describe('ClosedByCookieInterceptor', () => {
  let locationService: LocationService;
  let httpTestingController: HttpTestingController;
  let http: HttpClient;

  const successData = {
    closedByCookie: true,
  };

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        { provide: LocationService, useClass: LocationServiceStub },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ClosedByCookieInterceptor,
          multi: true,
          deps: [LocationService, DeviceDetectorService],
        },
      ],
    }),
  );

  beforeEach(() => {
    locationService = TestBed.inject(LocationService);
    httpTestingController = TestBed.inject(HttpTestingController);
    http = TestBed.inject(HttpClient);
    jest.spyOn(locationService, 'path').mockReturnValue('/600103/1/form');
  });

  afterEach(waitForAsync(() => httpTestingController.verify()));

  it('should be called when url is matched and there is flag', (done) => {
    jest.spyOn(locationService, 'href');
    const url =
      'https://pgu-uat-fed.test.gosuslugi.ru/api/service/10000000102/scenario/checkIfOrderIdExists';
    http.get(url).subscribe(() => done());
    httpTestingController.expectOne(url).flush(successData);
    expect(locationService.href).toHaveBeenCalled();
  });

  it('should not be called when url is matched and there is no flag', (done) => {
    jest.spyOn(locationService, 'href');
    const url =
      'https://pgu-uat-fed.test.gosuslugi.ru/api/service/10000000102/scenario/checkIfOrderIdExists';
    http.get(url).subscribe(() => done());
    httpTestingController.expectOne(url).flush({});
    expect(locationService.href).not.toHaveBeenCalled();
  });

  it('should not be called when url is not matched', (done) => {
    jest.spyOn(locationService, 'href');
    const url = 'https://pgu-uat-fed.test.gosuslugi.ru/api/service/10000000102/scenario/getService';
    http.get(url).subscribe(() => done());
    httpTestingController.expectOne(url).flush({});
    expect(locationService.href).not.toHaveBeenCalled();
  });
});
