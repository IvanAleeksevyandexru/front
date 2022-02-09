import { UserAuthInterceptor } from './user-auth.interceptor';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppConfig } from '../../app.config';
import { MockProvider } from 'ng-mocks';

describe('UserAuthInterceptor', () => {
  let authInterceptor: UserAuthInterceptor;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MockProvider(AppConfig), UserAuthInterceptor],
    });

    authInterceptor = TestBed.inject(UserAuthInterceptor);
  });

  it('should create an instance', () => {
    expect(authInterceptor).toBeDefined();
  });
});
