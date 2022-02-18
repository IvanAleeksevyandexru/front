import { TestBed } from '@angular/core/testing';
import { CookieService } from 'ngx-cookie-service';
import { SessionService } from './session.service';

describe('ServiceDataService', () => {
  let service: SessionService;
  let cookieService: CookieService;

  const init = () => {
    TestBed.configureTestingModule({
      providers: [SessionService, CookieService],
    });
  };

  beforeEach(init);

  beforeEach(() => {
    cookieService = TestBed.inject(CookieService);

    Object.defineProperty(window.document, 'cookie', {
      writable: true,
      value: 'u=123456;isUnderConstructionModeEnabled=false',
    });

    service = TestBed.inject(SessionService);
  });

  it('userId getter should return id from u cookie or empty string', () => {
    expect(service.userId).toBe('123456');

    window.document.cookie = '';
    // сбрасываем экземпляр сервиса
    TestBed.resetTestingModule();
    init();
    service = TestBed.inject(SessionService);

    expect(service.userId).toBe('');
  });

  it('isUnderConstructionModeEnabled getter should return string from isUnderConstructionModeEnabled cookie or empty string', () => {
    expect(service.isUnderConstructionModeEnabled).toBe('false');

    window.document.cookie = '';
    TestBed.resetTestingModule();
    init();
    service = TestBed.inject(SessionService);

    expect(service.isUnderConstructionModeEnabled).toBe('');
  });
});
