import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { HealthService } from '@epgu/epgu-lib';
import { CurrentAnswersService } from '../../../screen/current-answers.service';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { CachedAnswersService } from '../../../shared/services/cached-answers/cached-answers.service';
import { LoggerService } from '@epgu/epgu-constructor-ui-kit';
import { LoggerServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { UtilsService } from '../utils/utils.service';
import { GlobalErrorHandler } from './global-error.service';
import { HealthServiceStub } from './health.service.stub';
import { configureTestSuite } from 'ng-bullet';

describe('GlobalErrorHandler', () => {
  let globalError: GlobalErrorHandler;
  let healthService: HealthService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        GlobalErrorHandler,
        { provide: ScreenService, useClass: ScreenServiceStub },
        CurrentAnswersService,
        CachedAnswersService,
        UtilsService,
        { provide: HealthService, useClass: HealthServiceStub },
        { provide: LoggerService, useClass: LoggerServiceStub },
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
