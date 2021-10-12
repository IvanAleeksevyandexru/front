import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';
import { RestService } from './rest.service';
import { LocalStorageService, LocalStorageServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { LogicComponentMethods, RestAttrsDto } from '@epgu/epgu-constructor-types';

describe('RestService', () => {
  let service: RestService;
  let httpTestingController: HttpTestingController;
  let localStorage: LocalStorageService;
  const componentPOST: RestAttrsDto = {
    url: 'url',
    headers: { headers: 'headers' },
    method: 'POST' as LogicComponentMethods,
    body: 'body',
    path: 'path',
  };

  const componentGET: RestAttrsDto = ({
    url: 'url',
    headers: { headers: 'headers' },
    method: 'GET' as LogicComponentMethods,
    path: 'path',
  } as unknown) as RestAttrsDto;

  const componentWithTimeOut: RestAttrsDto = {
    url: 'url',
    headers: { headers: 'headers' },
    method: 'POST' as LogicComponentMethods,
    body: 'body',
    path: 'path',
    timeout: '10',
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RestService, { provide: LocalStorageService, useClass: LocalStorageServiceStub }],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(RestService);
    httpTestingController = TestBed.inject(HttpTestingController);
    localStorage = TestBed.inject(LocalStorageService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('fetch', () => {
    it('should be return request with body', () => {
      service.fetch(componentPOST).subscribe();
      const req = httpTestingController.expectOne('url');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toBe('body');
    });

    it('should be return request without body', () => {
      service.fetch(componentGET).subscribe();
      const req = httpTestingController.expectOne('url');
      expect(req.request.method).toBe('GET');
      expect(req.request.body).toBeNull();
    });

    it('should be set value to localStorage', () => {
      const spy = jest.spyOn(localStorage, 'setRaw');
      service.fetch(componentPOST).subscribe();
      const req = httpTestingController.expectOne('url');
      expect(spy).toHaveBeenCalledWith(req.request.url, req.request.body);
    });
  });
});
