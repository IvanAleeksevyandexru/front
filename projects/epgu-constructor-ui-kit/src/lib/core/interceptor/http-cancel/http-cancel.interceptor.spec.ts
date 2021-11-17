import { HttpCancelInterceptor } from './http-cancel.interceptor';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpCancelService } from './http-cancel.service';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

describe('HttpCancelInterceptor', () => {
  let interceptor: HttpCancelInterceptor;
  let httpCancelService: HttpCancelService;
  let httpTestingController: HttpTestingController;
  let http: HttpClient;

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        HttpCancelInterceptor,
        HttpCancelService,
        { provide: HTTP_INTERCEPTORS, useClass: HttpCancelInterceptor, multi: true },
      ],
    }),
  );

  beforeEach(() => {
    interceptor = TestBed.inject(HttpCancelInterceptor);
    httpCancelService = TestBed.inject(HttpCancelService);
    httpTestingController = TestBed.inject(HttpTestingController);
    http = TestBed.inject(HttpClient);
  });

  afterEach(waitForAsync(() => httpTestingController.verify()));

  it('should cancel request if onCancelPendingRequests is emitted', () => {
    const cancelSubject = new Subject<void>();

    jest.spyOn(httpCancelService, 'onCancelPendingRequests').mockReturnValue(cancelSubject);

    const url = 'https://pgu-uat-fed.test.gosuslugi.ru/api/test';
    http.get(url).subscribe();
    const req = httpTestingController.expectOne(url);

    expect(req.cancelled).toBeFalsy();
    cancelSubject.next();
    expect(req.cancelled).toBeTruthy();
  });
});
