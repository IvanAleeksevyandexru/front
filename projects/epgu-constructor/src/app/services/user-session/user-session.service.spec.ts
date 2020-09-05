import { async, TestBed } from '@angular/core/testing';

import { UserSessionService } from './user-session.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConfigService } from '../../config/config.service';
import { ConfigServiceStub } from '../../config/config.service.stub';

describe('UserSessionService', () => {
  let service: UserSessionService;
  let http: HttpTestingController;
  let cnstrctrConfigSrv: ConfigService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserSessionService,
        { provide: ConfigService, useClass: ConfigServiceStub }
      ]
    });
    service = TestBed.inject(UserSessionService);
    http = TestBed.inject(HttpTestingController);
    cnstrctrConfigSrv = TestBed.inject(ConfigService);
  }));

  afterEach(async(() => http.verify()));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
