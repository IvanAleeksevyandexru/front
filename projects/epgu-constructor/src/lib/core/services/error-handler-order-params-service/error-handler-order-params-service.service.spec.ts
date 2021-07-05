import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { UtilsService } from '@epgu/epgu-constructor-ui-kit';

import {
  ErrorHandlerOrderParamsServiceService,
} from './error-handler-order-params-service.service';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';


describe('ErrorHandlerOrderParamsServiceService', () => {
  let service: ErrorHandlerOrderParamsServiceService;
  let screenService: ScreenService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        ErrorHandlerOrderParamsServiceService,
        { provide: ScreenService, useClass: ScreenServiceStub },
        UtilsService,
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(ErrorHandlerOrderParamsServiceService);
    screenService = TestBed.inject(ScreenService);
  });

  it('should return params without order id', () => {
    expect(service.getParams().orderId).toBeUndefined();
  });

  it('should return params with order id', () => {
    const orderId = 42;
    jest.spyOn(screenService, 'getStore').mockReturnValue({ orderId });
    expect(service.getParams().orderId).toBe(orderId);
  });

  it('should return params with callBackOrderId', () => {
    const callBackOrderId = '42';
    jest.spyOn(screenService, 'getStore').mockReturnValue({ callBackOrderId });
    expect(service.getParams().orderId).toBe(callBackOrderId);
  });

  it('should return params with id and name', () => {
    const id = 'w42';
    const name = 'Какая та компанента';
    jest.spyOn(screenService, 'getStore').mockReturnValue({ display: { id, name }});
    expect(service.getParams().id).toBe(id);
    expect(service.getParams().name).toBe('Kakaia ta kompanenta');
  });
});
