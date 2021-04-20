import { TestBed } from '@angular/core/testing';
import { SessionService } from './session.service';
import { configureTestSuite } from 'ng-bullet';

describe('ServiceDataService', () => {
  let service: SessionService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [SessionService]
    });
  });

  beforeEach(() => {
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
});
