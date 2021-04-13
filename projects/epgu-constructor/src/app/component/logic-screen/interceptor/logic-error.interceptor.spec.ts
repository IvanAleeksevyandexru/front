import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { throwError } from 'rxjs/internal/observable/throwError';

import { LogicErrorInterceptor } from './logic-error-interceptor.service';
import { LocalStorageService } from '../../../core/services/local-storage/local-storage.service';
import { LocalStorageServiceStub } from '../../../core/services/local-storage/local-storage.service.stub';

describe('LogicErrorInterceptor', () => {
  let localStorageService: LocalStorageService;
  let interceptor: LogicErrorInterceptor;
  const mockHandler = {
    handle: jest.fn(() =>
      throwError(
        new HttpErrorResponse({
          status: 500,
          error: { message: 'This is an error' },
        }),
      ),
    ),
  };

  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
        LogicErrorInterceptor,
      ],
    }),
  );

  beforeEach(() => {
    interceptor = TestBed.inject(LogicErrorInterceptor);
    localStorageService = TestBed.inject(LocalStorageService);
  });

  it('should be return status text logic component', () => {
    interceptor.intercept(new HttpRequest<unknown>('GET', 'url'), mockHandler).subscribe(
      () => {
        fail('Expected error');
      },
      (error) => {
        expect(error.statusText).toBe('logic component');
      },
    );
  });

  it('should be return status text without logic component', () => {
    jest.spyOn(localStorageService, 'get').mockReturnValue('nothing');

    interceptor.intercept(new HttpRequest<unknown>('GET', 'url'), mockHandler).subscribe(
      () => {
        fail('Expected error');
      },
      (error) => {
        expect(error.statusText).not.toBe('logic component');
      },
    );
  });
});
