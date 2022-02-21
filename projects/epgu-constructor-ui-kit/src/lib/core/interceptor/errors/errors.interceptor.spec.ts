import { HttpClient, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ErrorHandlerAbstractService, ERROR_HANDLER_SERVICE } from './errors.token';
import { ErrorsInterceptor } from './errors.interceptor';
import { Injectable } from '@angular/core';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

@Injectable()
class TestErrorHandlerService implements ErrorHandlerAbstractService {
  handleResponseError(): Observable<HttpEvent<void>> {
    return undefined;
  }

  handleResponse(): Observable<HttpEvent<void>> {
    return undefined;
  }
}

// TODO: дочинить тесты
xdescribe('ErrorsInterceptor', () => {
  let service: TestErrorHandlerService;
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TestErrorHandlerService,
        ErrorsInterceptor,
        { provide: ERROR_HANDLER_SERVICE, useClass: TestErrorHandlerService, multi: true },
      ],
    }),
  );

  beforeEach(() => {
    service = TestBed.inject(TestErrorHandlerService);
    http = TestBed.inject(HttpClient);
  });

  afterEach(() => httpMock.verify());

  it('should handle request if no error is emitted', () => {
    const spy = jest.spyOn(service, 'handleResponse');
    const url = 'https://pgu-uat-fed.test.gosuslugi.ru/api/test';

    http.get(url).subscribe((response) => {
      expect(response).toBeTruthy();
      expect(spy).not.toHaveBeenCalled();
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush('ok');
  });

  it('should handle error if there error is catched', () => {
    const spy = jest.spyOn(service, 'handleResponseError');
    const url = 'https://pgu-uat-fed.test.gosuslugi.ru/api/test';

    http.get(url).subscribe((response) => {
      expect(response).toBeFalsy();
      expect(spy).toHaveBeenCalled();
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush('ok');
  });
});
