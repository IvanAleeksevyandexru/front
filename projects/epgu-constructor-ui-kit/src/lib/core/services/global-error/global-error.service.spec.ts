import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { HealthService } from '../health/health.service';
import { GlobalErrorHandler } from './global-error.service';
import { configureTestSuite } from 'ng-bullet';
import { ERROR_HANDLER_ORDER_PARAMS_SERVICES } from './global-error.token';
import { DownloadService } from '../download/download.service';
import { LoggerService } from '../logger/logger.service';
import { HealthServiceStub } from '../../interceptor/health/health.service.stub';
import { LoggerServiceStub } from '../logger/logger.service.stub';
import { MicroAppErrorHandlerOrderParamsServiceService } from '../../../micro-app/micro-app-error-handler-order-params-service/micro-app-error-handler-order-params-service.service';
import { MicroAppStateQuery } from '../../../micro-app/micro-app-state/micro-app-state.query';
import { MicroAppStateQueryStub } from '../../../micro-app/micro-app-state/micro-app-state.query.stub';
import { ObjectHelperService } from '../object-helper/object-helper.service';
import { WordTransformService } from '../word-transform/word-transform.service';

describe('GlobalErrorHandler', () => {
  let globalError: GlobalErrorHandler;
  let healthService: HealthService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        GlobalErrorHandler,
        { provide: MicroAppStateQuery, useClass: MicroAppStateQueryStub },
        DownloadService,
        ObjectHelperService,
        WordTransformService,
        { provide: HealthService, useClass: HealthServiceStub },
        { provide: LoggerService, useClass: LoggerServiceStub },
        {
          provide: ERROR_HANDLER_ORDER_PARAMS_SERVICES,
          useClass: MicroAppErrorHandlerOrderParamsServiceService,
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
