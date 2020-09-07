import { async, TestBed } from '@angular/core/testing';

import { DadataApiService } from './dadata-api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConfigService } from '../../../config/config.service';
import { ConfigServiceStub } from '../../../config/config.service.stub';
import { UserSessionService } from '../../user-session/user-session.service';

describe('DadataApiService', () => {
  let service: DadataApiService;
  let http: HttpTestingController;
  let cnstrctrConfigSrv: ConfigService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DadataApiService,
        UserSessionService,
        { provide: ConfigService, useClass: ConfigServiceStub }
      ]
    });
    service = TestBed.inject(DadataApiService);
    http = TestBed.inject(HttpTestingController);
    cnstrctrConfigSrv = TestBed.inject(ConfigService);
  }));

  afterEach(async(() => http.verify()));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
