import { TestBed } from '@angular/core/testing';

import { HealthService } from 'epgu-lib';
import { GlobalErrorHandler } from './global-error.service';
import { HealthServiceStub } from './health.service.stub';
import { HttpErrorResponse } from '@angular/common/http';

describe('GlobalErrorHandler', () => {
  let globalError: GlobalErrorHandler;
  let healthService: HealthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GlobalErrorHandler, { provide: HealthService, useClass: HealthServiceStub }],
    });
    healthService = TestBed.inject(HealthService);
    globalError = TestBed.inject(GlobalErrorHandler);
  });

  it('test base error', () => {
    spyOn(healthService, 'measureStart').and.callThrough();
    globalError.handleError(new Error());
    expect(healthService.measureStart).toHaveBeenCalled();
  });

  it('test httpError', () => {
    spyOn(healthService, 'measureStart').and.callThrough();
    globalError.handleError(new HttpErrorResponse({}));
    expect(healthService.measureStart).toHaveBeenCalledTimes(0);
  });
});
