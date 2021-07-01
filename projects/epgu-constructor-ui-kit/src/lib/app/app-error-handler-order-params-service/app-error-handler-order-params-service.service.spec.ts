import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { AppErrorHandlerOrderParamsServiceService } from './app-error-handler-order-params-service.service';
import { UtilsService } from '../../core/services/utils/utils.service';
import { AppStateQuery } from '../app-state/app-state.query';
import { AppStateQueryStub } from '../app-state/app-state.query.stub';


describe('AppErrorHandlerOrderParamsServiceService', () => {
  let service: AppErrorHandlerOrderParamsServiceService;
  let appStateQuery: AppStateQuery<unknown, unknown>;
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        AppErrorHandlerOrderParamsServiceService,
        UtilsService,
        { provide: AppStateQuery, useClass: AppStateQueryStub }
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(AppErrorHandlerOrderParamsServiceService);
    appStateQuery = TestBed.inject(AppStateQuery);
  });

  it('should return params without order id', () => {
    expect(service.getParams().orderId).toBeUndefined();
  });

  it('should return params with order id', () => {
    const orderId = 42;
    jest.spyOn(appStateQuery, 'fpHealthPayload', 'get').mockReturnValue({ orderId });
    expect(service.getParams().orderId).toBe(orderId);
  });

  it('should return params with id and name', () => {
    const id = 'w42';
    const name = 'Какая та компанента';
    jest.spyOn(appStateQuery, 'fpHealthPayload', 'get').mockReturnValue({  id, name });
    expect(service.getParams().id).toBe(id);
    expect(service.getParams().name).toBe('Kakaia ta kompanenta');
  });
});
