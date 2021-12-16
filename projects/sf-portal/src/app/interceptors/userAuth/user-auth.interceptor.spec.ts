import { UserAuthInterceptor } from './user-auth.interceptor';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('UserAuthInterceptor', () => {
  let authInterceptor: UserAuthInterceptor;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserAuthInterceptor],
    });

    authInterceptor = TestBed.get(UserAuthInterceptor);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should create an instance', () => {
    expect(authInterceptor).toBeDefined();
  });
});
