import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ConfigApiService } from './config-api.service';
import { configureTestSuite } from 'ng-bullet';
import { DEFAULT_CONFIG_ID } from '@epgu/epgu-constructor-types';
import { ConfigService } from '../config/config.service';
import { ConfigServiceStub } from '../config/config.service.stub';

describe('ConfigApiService', () => {
  let service: ConfigApiService;
  let http: HttpTestingController;
  let responseMock = [42];

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ConfigApiService, { provide: ConfigService, useClass: ConfigServiceStub }],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(ConfigApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(waitForAsync(() => http.verify()));

  describe('getFormPlayerConfig()', () => {
    it('should call http with get method', fakeAsync(() => {
      service.getFormPlayerConfig().subscribe((response) => expect(response).toBe(responseMock));
      const req = http.expectOne(`/api/pgu-service-config/config/${DEFAULT_CONFIG_ID}`);
      expect(req.request.method).toBe('GET');
      req.flush(responseMock);
      tick();
    }));
  });
});
