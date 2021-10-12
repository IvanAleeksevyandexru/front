import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { configureTestSuite } from 'ng-bullet';
import {
  UnsubscribeService,
  ConfigService,
  ConfigServiceStub,
  UnsubscribeServiceStub,
} from '@epgu/epgu-constructor-ui-kit';

import { AbstractPaymentComponent } from './abstract-payment.component';
import { ScreenService } from '../../../../screen/screen.service';
import { DictionaryApiService } from '../../../../shared/services/dictionary/dictionary-api.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ActionService } from '../../../../shared/directives/action/action.service';
import { ActionServiceStub } from '../../../../shared/directives/action/action.service.stub';
import { PaymentService } from './payment.service';
import { PaymentServiceStub } from './payment.service.stub';
import { LocationService, LocationServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { LocalStorageService, LocalStorageServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { DictionaryApiServiceStub } from '../../../../shared/services/dictionary/dictionary-api.service.stub';
import { DatesToolsService } from '@epgu/epgu-constructor-ui-kit';
import { DatesToolsServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { billsInfoMock, billsInfoMockPaid, billsInfoMockPaidWithError } from './payment-data.stub';
import { NEXT_STEP_ACTION } from '../../../../shared/constants/actions';
import { LAST_SCENARIO_KEY } from '../../../../shared/constants/form-player';
import { MockProvider } from 'ng-mocks';

describe('AbstractPaymentComponent', () => {
  let component: AbstractPaymentComponent;
  let fixture: ComponentFixture<AbstractPaymentComponent>;
  let screenService: ScreenService;
  let dictionaryApiService: DictionaryApiService;
  let paymentService: PaymentService;
  let locationService: LocationService;
  let localStorageService: LocalStorageService;
  const mockComponent = {
    id: 'pay1ms1',
    type: 'PaymentScr',
    label: 'Регистрация расторжения брака',
    attrs: {
      nsi: 'fns_zgs_getpay_79272',
      dictItemCode: '01',
      ref: {
        fiasCode: 'ms1.value',
      },
      refs: {},
    },
    arguments: {},
    value: '',
    required: true,
  };
  const mockComponentWithData = {
    ...mockComponent,
    value: JSON.stringify({
      billNumber: '100',
      billId: 100,
      amount: '100',
      billName: '100',
      billDate: '100',
      payCode: 100,
      originalAmount: '100',
    }),
  };
  const orderIdMock = 100;
  const dictionaryResponseMock = {
    error: { code: 0, message: 'operation completed' },
    fieldErrors: [],
    total: 1,
    items: [
      {
        value: '153',
        parentValue: null,
        title: 'УФК по г. Москве (Главное управление Минюста России по Москве)',
        isLeaf: true,
        children: [],
        attributes: [],
        source: null,
        attributeValues: {
          DATAK: '',
        },
      },
    ],
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [AbstractPaymentComponent],
      imports: [],
      providers: [
        MockProvider(CurrentAnswersService),
        { provide: UnsubscribeService, useClass: UnsubscribeServiceStub },
        { provide: PaymentService, useClass: PaymentServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ActionService, useClass: ActionServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: LocationService, useClass: LocationServiceStub },
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
        { provide: DatesToolsService, useClass: DatesToolsServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    screenService = TestBed.inject(ScreenService);
    dictionaryApiService = TestBed.inject(DictionaryApiService);
    paymentService = TestBed.inject(PaymentService);
    locationService = TestBed.inject(LocationService);
    localStorageService = TestBed.inject(LocalStorageService);
    fixture = TestBed.createComponent(AbstractPaymentComponent);
    component = fixture.componentInstance;
    screenService.component = mockComponent;
    screenService.orderId = orderIdMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('init$', () => {
    it('should be change data', () => {
      expect(component.isPaid).toBeFalsy();
      expect(component.inLoading).toBeFalsy();
      expect(component.data).toEqual(mockComponent);
    });
  });

  describe('loadPaymentInfo', () => {
    it('should be call getBillsInfoByBillId with bill', () => {
      const getBillsInfoByBillIdSpy = jest.spyOn(paymentService, 'getBillsInfoByBillId');
      screenService.component = mockComponentWithData;
      component.ngOnInit();
      expect(getBillsInfoByBillIdSpy).toHaveBeenCalledWith(100);
    });

    it('should be call loadPaymentInfoOldType', () => {
      const loadPaymentInfoReqSpy = jest
        .spyOn(paymentService, 'loadPaymentInfo')
        .mockReturnValue(of(dictionaryResponseMock as any));
      const getUinByOrderIdReqSpy = jest
        .spyOn(component.paymentService, 'getUinByOrderId')
        .mockReturnValue(of({ value: '0316373317011700000057047' }));
      const getBillsInfoByUINReqSpy = jest
        .spyOn(component.paymentService, 'getBillsInfoByUIN')
        .mockReturnValue(of(billsInfoMock));
      component.ngOnInit();

      expect(loadPaymentInfoReqSpy).toHaveBeenCalledWith(mockComponent.attrs);
      expect(getUinByOrderIdReqSpy).toHaveBeenCalledWith(orderIdMock, 1, dictionaryResponseMock);
      expect(getBillsInfoByUINReqSpy).toHaveBeenCalledWith(
        'PRIOR0316373317011700000057047',
        orderIdMock,
      );
    });
  });

  describe('nextStep', () => {
    it('should be call switchAction and update currentAnswersService', () => {
      const spy = jest.spyOn(component.actionService, 'switchAction');
      component.nextStep();
      expect(component.currentAnswersService.state).toEqual({
        uin: 'PRIOR234324234234234',
        amount: '3244',
        amountWithoutDiscount: null,
        paymentPurpose: null,
        receiver: ' ',
        billId: null,
      });
      expect(spy).toHaveBeenCalledWith(NEXT_STEP_ACTION, 'pay1ms1');
    });
  });

  describe('redirectToPayWindow', () => {
    it('should be call locationService.href', () => {
      const locationServiceSpy = jest.spyOn(locationService, 'href');
      const localStorageServiceSpy = jest.spyOn(localStorageService, 'set');
      component.redirectToPayWindow();
      expect(localStorageServiceSpy).toHaveBeenCalledWith(LAST_SCENARIO_KEY, {
        scenarioDto: {
          cachedAnswers: [],
        },
      });
      expect(locationServiceSpy).toHaveBeenCalledWith('');
    });
  });

  describe('setPaymentStatusFromErrorRequest', () => {
    beforeEach(() => {
      screenService.component = mockComponentWithData;
    });

    it('should be set status error', () => {
      jest
        .spyOn(paymentService, 'getBillsInfoByBillId')
        .mockReturnValue(throwError({ status: 500 }));
      component.ngOnInit();
      expect(component.status).toBe('error');
    });

    it('should be set status serverError', () => {
      jest
        .spyOn(paymentService, 'getBillsInfoByBillId')
        .mockReturnValue(throwError({ status: 400 }));
      component.ngOnInit();
      expect(component.status).toBe('serverError');
    });
  });

  describe('getBillsInfoByBillIdSuccess', () => {
    beforeEach(() => {
      screenService.component = mockComponentWithData;
    });

    it('should be call nextStep', () => {
      jest.spyOn(paymentService, 'getBillsInfoByBillId').mockReturnValue(of(billsInfoMockPaid));
      const spy = jest.spyOn(component, 'nextStep');
      component.ngOnInit();
      expect(component.isPaid).toBeTruthy();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(component.inLoading).toBeFalsy();
    });

    it('should be skip nextStep', () => {
      const spy = jest.spyOn(component, 'nextStep');
      component.ngOnInit();
      expect(component.isPaid).toBeFalsy();
      expect(spy).toHaveBeenCalledTimes(0);
      expect(component.inLoading).toBeFalsy();
    });
  });

  describe('getBillsInfoByUINErrorsFromSuccess', () => {
    beforeEach(() => {
      screenService.component = mockComponentWithData;
    });

    it('should be set status error', () => {
      jest
        .spyOn(paymentService, 'getBillsInfoByBillId')
        .mockReturnValue(of(billsInfoMockPaidWithError));
      component.ngOnInit();
      expect(component.isShown).toBeFalsy();
      expect(component.inLoading).toBeFalsy();
    });

    it('should be call nextStep', () => {
      const spy = jest.spyOn(component, 'nextStep');
      jest
        .spyOn(paymentService, 'getBillsInfoByBillId')
        .mockReturnValue(of(billsInfoMockPaidWithError));
      component.ngOnInit();
      expect(component.isShown).toBeFalsy();
      expect(component.inLoading).toBeFalsy();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
