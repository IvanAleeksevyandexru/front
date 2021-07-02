import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { BatchRecorder, Tracer } from '@epgu/zipkin';

import { TracingService } from './tracing.service';
import { SessionService } from '../session/session.service';
import { ConfigService } from '../config/config.service';
import { TRACE_ALLOWED_REMOTE_SERVICES } from './tracing.token';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigServiceStub } from '../config/config.service.stub';

describe('TracingService', () => {
  let service: TracingService;
  const someUrl1 = '/some/url/1';
  const someUrl2 = '/some/url/2';

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TracingService,
        SessionService,
        { provide: ConfigService, useClass: ConfigServiceStub },
        {
          provide: TRACE_ALLOWED_REMOTE_SERVICES,
          useValue: [someUrl1, someUrl2],
        },
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(TracingService);
  });

  describe('init()', () => {
    it('should init recorder', () => {
      service.init(true);
      expect(service['recorder']).not.toBeUndefined();
      expect(service['recorder']).toBeInstanceOf(BatchRecorder);
    });
    it('should init tracer', () => {
      service.init(true);
      expect(service.tracer).not.toBeNull();
      expect(service.tracer).toBeInstanceOf(Tracer);
    });
    it('shouldn\'t init recorder', () => {
      service.init(false);
      expect(service['recorder']).toBeUndefined();
      expect(service['recorder']).not.toBeInstanceOf(BatchRecorder);
    });
    it('shouldn\'t init tracer', () => {
      service.init(false);
      expect(service.tracer).not.toBeInstanceOf(Tracer);
    });
  });

  describe('isAllowedRemoteServices()', () => {
    it('should return true', () => {
      expect(service.isAllowedRemoteServices(someUrl1)).toBeTruthy();
    });
    it('should return false', () => {
      expect(service.isAllowedRemoteServices('/some/url/3')).toBeFalsy();
    });
  });

  describe('tracer()', () => {
    it('should get tracer', () => {
      service.init(true);
      expect(service.tracer).toBe(service['_tracer']);
    });
  });

  describe('serviceCode()', () => {
    it('should update defaultTags.serviceCode', () => {
      const serviceCode = '42';
      service.init(true);
      service.serviceCode = serviceCode;
      expect(service['defaultTags']['serviceCode']).toBe(serviceCode);
    });
  });
});
