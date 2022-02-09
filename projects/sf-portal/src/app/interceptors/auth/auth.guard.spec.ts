import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { WINDOW } from '@epgu/epgu-constructor-ui-kit';
import { MockProvider } from 'ng-mocks';
import { HelperService } from '@epgu/ui/services/helper';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: WINDOW, useValue: { navigator: {} } }, MockProvider(HelperService)],
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
