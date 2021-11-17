import { TestBed } from '@angular/core/testing';
import { HttpEvent, HttpRequest, HttpXhrBackend } from '@angular/common/http';

import { HealthInterceptor } from './health.interceptor';
import { HEALTH_SERVICE, HealthHandler } from './health.token';
import { Observable } from 'rxjs/internal/Observable';
import { ActionRequestPayload } from '@epgu/epgu-constructor-types';
import { Injectable } from '@angular/core';

const apiUrl = 'http://some-url.com/api/book';
const dto = {
  scenarioDto: {
    display: {
      id: 'w1',
      name: 'Приветствие',
      components: [
        {
          id: 'zp1',
          type: 'DocInput',
          label: 'Загранпаспорт',
        },
      ],
    },
  },
} as ActionRequestPayload;

@Injectable()
class TestHealthHandlerService implements HealthHandler {
  handleRequest(): Observable<HttpEvent<unknown>> {
    return undefined;
  }
}

describe('HealthInterceptor', () => {
  let interceptor: HealthInterceptor;
  let service: HealthHandler;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HealthInterceptor,
        {
          provide: HEALTH_SERVICE,
          useClass: TestHealthHandlerService,
        },
      ],
    });
  });

  beforeEach(() => {
    interceptor = TestBed.inject(HealthInterceptor);
    service = (TestBed.inject(HEALTH_SERVICE) as unknown) as HealthHandler;
  });

  it('should call HealthHandler handleRequest on http request', () => {
    const spy = jest.spyOn(service, 'handleRequest');
    const request = new HttpRequest('GET', apiUrl);
    const handler = new HttpXhrBackend(null);
    interceptor.intercept(request, handler);
    expect(spy).toBeCalledWith(request, handler);
  });
});
