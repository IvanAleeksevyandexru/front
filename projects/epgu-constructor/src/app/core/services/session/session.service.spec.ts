import { TestBed } from '@angular/core/testing';
import { SessionService } from './session.service';

describe('ServiceDataService', () => {
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SessionService]
    });
    service = TestBed.inject(SessionService);

    Object.defineProperty(window.document, 'cookie', {
      writable: true,
      value: 'u=123456',
    });
  });

  it('should extract extract from cookie', () => {
    const { userId } = service['getSessionFromCookie']();
    expect(userId).toEqual('123456');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
