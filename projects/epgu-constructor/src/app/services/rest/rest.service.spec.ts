import { async, TestBed } from '@angular/core/testing';

import { RestService } from './rest.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConstructorConfigService } from '../config/constructor-config.service';
import { ConstructorConfigServiceStub } from '../config/constructor-config.service.stub';

describe('RestService', () => {
  let service: RestService;
  let http: HttpTestingController;
  let cnstrctrConfigSrv: ConstructorConfigService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RestService,
        { provide: ConstructorConfigService, useClass: ConstructorConfigServiceStub }
      ]
    });
    service = TestBed.inject(RestService);
    http = TestBed.inject(HttpTestingController);
    cnstrctrConfigSrv = TestBed.inject(ConstructorConfigService);
  }));

  afterEach(async(() => http.verify()));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
