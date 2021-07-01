import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { HealthService } from '@epgu/epgu-lib';
import { GlobalErrorHandler } from './global-error.service';
import { configureTestSuite } from 'ng-bullet';
import { ERROR_HANDLER_ORDER_PARAMS_SERVICES } from './global-error.token';
import { UtilsService } from '../utils/utils.service';
import { LoggerService } from '../logger/logger.service';
import { HealthServiceStub } from '../../interceptor/health/health.service.stub';
import { LoggerServiceStub } from '../logger/logger.service.stub';
import { AppErrorHandlerOrderParamsServiceService } from '../../../app/app-error-handler-order-params-service/app-error-handler-order-params-service.service';
import { AppStateQuery } from '../../../app/app-state/app-state.query';
import { AppStateQueryStub } from '../../../app/app-state/app-state.query.stub';

describe('GlobalErrorHandler', () => {
  let globalError: GlobalErrorHandler;
  let healthService: HealthService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        GlobalErrorHandler,
        { provide: AppStateQuery, useClass: AppStateQueryStub },
        UtilsService,
        { provide: HealthService, useClass: HealthServiceStub },
        { provide: LoggerService, useClass: LoggerServiceStub },
        {
          provide: ERROR_HANDLER_ORDER_PARAMS_SERVICES,
          useClass: AppErrorHandlerOrderParamsServiceService,
        },
      ],
    });
  });

  beforeEach(() => {
    healthService = TestBed.inject(HealthService);
    globalError = TestBed.inject(GlobalErrorHandler);
  });

  it('test base error', () => {
    spyOn(healthService, 'measureStart').and.callThrough();
    // @ts-ignore
    globalError.handleError(new Error());
    expect(healthService.measureStart).toHaveBeenCalled();
  });

  it('test httpError', () => {
    spyOn(healthService, 'measureStart').and.callThrough();
    // @ts-ignore
    globalError.handleError(new HttpErrorResponse({}));
    expect(healthService.measureStart).toHaveBeenCalledTimes(0);
  });
});
