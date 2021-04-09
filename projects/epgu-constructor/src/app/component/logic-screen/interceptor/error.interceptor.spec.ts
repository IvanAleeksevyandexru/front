import { TestBed } from '@angular/core/testing';

import { ErrorInterceptor } from './error.interceptor';
import { LocalStorageService } from '../../../core/services/local-storage/local-storage.service';
import { LocalStorageServiceStub } from '../../../core/services/local-storage/local-storage.service.stub';

describe('ErrorInterceptor', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        ErrorInterceptor,
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
      ],
    }),
  );

  it('should be created', () => {
    const interceptor: ErrorInterceptor = TestBed.inject(ErrorInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
