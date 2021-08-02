import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { MicroAppErrorHandlerOrderParamsServiceService } from './micro-app-error-handler-order-params-service.service';
import { MicroAppStateQuery } from '../micro-app-state/micro-app-state.query';
import { MicroAppStateQueryStub } from '../micro-app-state/micro-app-state.query.stub';
import { WordTransformService } from '../../core/services/word-transform/word-transform.service';
import { TypeHelperService } from '../../core/services/type-helper/type-helper.service';


describe('MicroAppErrorHandlerOrderParamsServiceService', () => {
  let service: MicroAppErrorHandlerOrderParamsServiceService;
  let appStateQuery: MicroAppStateQuery<unknown, unknown>;
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        MicroAppErrorHandlerOrderParamsServiceService,
        WordTransformService,
        TypeHelperService,
        { provide: MicroAppStateQuery, useClass: MicroAppStateQueryStub },
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(MicroAppErrorHandlerOrderParamsServiceService);
    appStateQuery = TestBed.inject(MicroAppStateQuery);
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
