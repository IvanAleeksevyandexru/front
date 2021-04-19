import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';

import { LogicService } from './logic.service';
import { LocalStorageService } from '../../../core/services/local-storage/local-storage.service';
import { LocalStorageServiceStub } from '../../../core/services/local-storage/local-storage.service.stub';
import { ComponentValue } from '../logic.types';

describe('LogicService', () => {
  let service: LogicService;
  let httpTestingController: HttpTestingController;
  let localStorage: LocalStorageService;
  const componentsPOST: { id: string; value: ComponentValue }[] = [
    {
      id: 'rest1',
      value: {
        url: 'url',
        headers: { headers: 'headers' },
        method: 'POST',
        body: 'body',
        path: 'path',
      },
    },
  ];
  const componentsGET: { id: string; value: ComponentValue }[] = [
    {
      id: 'rest1',
      value: {
        url: 'url',
        headers: { headers: 'headers' },
        method: 'GET',
        path: 'path',
      },
    },
  ];
  const componentsWithTimeOut: { id: string; value: ComponentValue }[] = [
    {
      id: 'rest1',
      value: {
        url: 'url',
        headers: { headers: 'headers' },
        method: 'POST',
        body: 'body',
        path: 'path',
        timeout: '10',
      },
    },
  ];

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        LogicService,
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(LogicService);
    httpTestingController = TestBed.inject(HttpTestingController);
    localStorage = TestBed.inject(LocalStorageService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('fetch', () => {
    it('should be create http request', () => {
      const reqComponents = service.fetch(componentsPOST);
      expect(reqComponents.length).toBeGreaterThan(0);
    });
  });

  describe('callHttpMethod', () => {
    it('should be return request with body', () => {
      service.fetch(componentsPOST)[0].subscribe();
      const req = httpTestingController.expectOne('url');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toBe('body');
    });

    it('should be return request without body', () => {
      service.fetch(componentsGET)[0].subscribe();
      const req = httpTestingController.expectOne('url');
      expect(req.request.method).toBe('GET');
      expect(req.request.body).toBeNull();
    });

    it('should be set value to localStorage', () => {
      const spy = jest.spyOn(localStorage, 'set');
      service.fetch(componentsPOST)[0].subscribe();
      const req = httpTestingController.expectOne('url');
      expect(spy).toHaveBeenCalledWith(req.request.url, req.request.body);
    });
  });

  describe('createLogicAnswers', () => {
    jest.useFakeTimers();
    it('should be create logic answers if success response', () => {
      service.fetch(componentsPOST)[0].subscribe((response) => {
        expect(response).toEqual({
          rest1: {
            visited: true,
            value: '{"headers":[],"code":"200","body":{"body":"body"}}',
          },
        });
      });
      const req = httpTestingController.expectOne('url');
      req.flush({ body: 'body' });
      jest.runAllTimers();
    });

    it('should be create logic answers if error response', () => {
      service.fetch(componentsPOST)[0].subscribe((response) => {
        expect(response).toEqual({
          rest1: {
            visited: true,
            value: '{"headers":[],"code":"500","body":"body"}',
          },
        });
      });
      const req = httpTestingController.expectOne('url');
      req.flush('body', {
        status: 500,
        statusText: '',
      });
      jest.runAllTimers();
    });

    it('should be remove value from localStorage', () => {
      const spy = jest.spyOn(localStorage, 'delete');
      service.fetch(componentsPOST)[0].subscribe();
      const req = httpTestingController.expectOne('url');
      req.flush({ body: 'body' });
      expect(spy).toHaveBeenCalledWith(req.request.url);
    });

    it('should be create logic answers if timeout error', () => {
      service.fetch(componentsWithTimeOut)[0].subscribe((response) => {
        expect(response).toEqual({
          rest1: {
            visited: true,
            value: '{"headers":[],"code":"408","body":"408 Request Timeout"}',
          },
        });
      });
      httpTestingController.expectOne('url');
      jest.runAllTimers();
    });
  });
});
