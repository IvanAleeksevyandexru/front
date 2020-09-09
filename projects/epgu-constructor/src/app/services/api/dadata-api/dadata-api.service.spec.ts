import { async, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { DadataApiService } from './dadata-api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConfigService } from '../../../config/config.service';
import { ConfigServiceStub } from '../../../config/config.service.stub';

describe('DadataApiService', () => {
  let service: DadataApiService;
  let http: HttpTestingController;
  let cnstrctrConfigSrv: ConfigService;
  let responseMock = [42];
  let fiasCode = '738429';
  let externalApiUrl = 'https://svcdev-beta.test.gosuslugi.ru/api/nsi/v1';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DadataApiService,
        { provide: ConfigService, useClass: ConfigServiceStub }
      ]
    });
    service = TestBed.inject(DadataApiService);
    http = TestBed.inject(HttpTestingController);
    cnstrctrConfigSrv = TestBed.inject(ConfigService);
  }));

  afterEach(async(() => http.verify()));

  describe('getDadataByFias()', () => {
    it('should call http with get method', fakeAsync(() => {
      service.getDadataByFias(fiasCode).subscribe(response => expect(response).toBe(responseMock));
      const path = `${externalApiUrl}/dadata/${fiasCode}`;
      const req = http.expectOne(path);
      expect(req.request.method).toBe('GET');
      req.flush(responseMock);
      tick();
    }));
  });
});
