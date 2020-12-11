import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { HealthService } from 'epgu-lib';
import { CurrentAnswersService } from '../../../screen/current-answers.service';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { CachedAnswersService } from '../../../shared/services/applicant-answers/cached-answers.service';
import { UtilsService } from '../../../shared/services/utils/utils.service';
import { GlobalErrorHandler } from './global-error.service';
import { HealthServiceStub } from './health.service.stub';


describe('GlobalErrorHandler', () => {
  let globalError: GlobalErrorHandler;
  let healthService: HealthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GlobalErrorHandler,
        { provide: ScreenService, useClass: ScreenServiceStub },
        CurrentAnswersService,
        CachedAnswersService,
        UtilsService,
        { provide: HealthService, useClass: HealthServiceStub },
      ],
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
