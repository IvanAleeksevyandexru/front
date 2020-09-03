import { async, TestBed } from '@angular/core/testing';

import { DictionaryApiService } from './dictionary-api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConstructorConfigService } from '../config/constructor-config.service';
import { ConstructorConfigServiceStub } from '../config/constructor-config.service.stub';
import { UserSessionService } from '../user-session/user-session.service';
import { CookieService } from 'ngx-cookie-service';

describe('DictionaryApiService', () => {
  let service: DictionaryApiService;
  let http: HttpTestingController;
  let cnstrctrConfigSrv: ConstructorConfigService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DictionaryApiService,
        UserSessionService,
        CookieService,
        { provide: ConstructorConfigService, useClass: ConstructorConfigServiceStub }
      ]
    });
    service = TestBed.inject(DictionaryApiService);
    http = TestBed.inject(HttpTestingController);
    cnstrctrConfigSrv = TestBed.inject(ConstructorConfigService);
  }));

  afterEach(async(() => http.verify()));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
