import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { MockComponent, MockModule } from 'ng-mocks';
import { ScreenPadModule } from '@epgu/epgu-constructor-ui-kit';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { PaymentWayContainerComponent } from './payment-way-container.component';
import { PaymentWayComponent } from '../payment-way/payment-way.component';
import { DefaultUniqueScreenWrapperModule } from '../../../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { PaymentTypes, ProgramType } from '../../payment-way.types';

const mockComponent = {
  label: '',
  attrs: {
    paymentWays: [
      {
        paymentType: PaymentTypes.paid,
        amount: 1000,
        programType: ProgramType.other,
      },
      {
        paymentType: PaymentTypes.budget,
        amount: null,
        programType: ProgramType.preprof,
      },
      {
        paymentType: PaymentTypes.pfdod_certificate,
        amount: 1000,
        programType: null,
      },
    ],
    html: {
      paid: 'fake paid html',
      budget: 'fake budget html',
    },
  },
  value: '',
  required: false,
};

describe('PaymentWayContainerComponent', () => {
  let component: PaymentWayContainerComponent;
  let fixture: ComponentFixture<PaymentWayContainerComponent>;
  let screenService: ScreenService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentWayContainerComponent, MockComponent(PaymentWayComponent)],
      imports: [MockModule(DefaultUniqueScreenWrapperModule), MockModule(ScreenPadModule)],
      providers: [
        { provide: ScreenService, useClass: ScreenServiceStub },
        CurrentAnswersService,
        UnsubscribeService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentWayContainerComponent);
    component = fixture.componentInstance;
    screenService = TestBed.inject(ScreenService);
    screenService.component = mockComponent as any;
    fixture.detectChanges();
  });

  describe('init()', () => {
    const paymentWays = [
      {
        paymentType: PaymentTypes.budget,
        amount: null,
        programType: ProgramType.preprof,
      },
    ];

    it('should set selected', () => {
      expect(component.paymentWayControl.value).toBe('');

      screenService.component = { attrs: { paymentWays }} as any;
      fixture.detectChanges();
      expect(component.paymentWayControl.value).toEqual(PaymentTypes.budget);

      screenService.component = { ...mockComponent, value: 'test' } as any;
      fixture.detectChanges();
      expect(component.paymentWayControl.value).toEqual('test');
    });

    it('check required', () => {
      expect(component.paymentWayControl.valid).toBeTruthy();

      screenService.component = { ...mockComponent, required: true } as any;
      fixture.detectChanges();
      expect(component.paymentWayControl.valid).toBeFalsy();

      screenService.component = { attrs: { paymentWays }, required: true } as any;
      fixture.detectChanges();
      expect(component.paymentWayControl.valid).toBeTruthy();
    });
  });

  it('update control and setState', () => {
    expect(fixture.componentInstance.currentAnswersService.state).toBe('');
    expect(fixture.componentInstance.currentAnswersService.isValid).toBeTruthy();

    component.paymentWayControl.setValue('test');
    fixture.detectChanges();
    expect(fixture.componentInstance.currentAnswersService.state).toBe('test');
    expect(fixture.componentInstance.currentAnswersService.isValid).toBeTruthy();
  });

  it('should set value if there is only one paymentWay', () => {
    const specificMockComponent = {
      ...mockComponent,
      attrs: {
        ...mockComponent.attrs,
        paymentWays: [
          {
            paymentType: PaymentTypes.budget,
            amount: null,
            programType: ProgramType.preprof,
          },
        ],
      },
    };
    const reFixture = TestBed.createComponent(PaymentWayContainerComponent);
    const screenService = TestBed.inject(ScreenService);
    const currentAnswersService = TestBed.inject(CurrentAnswersService);
    const setStateMock = jest.spyOn(currentAnswersService, 'state', 'set');
    screenService.component = specificMockComponent as any;
    reFixture.detectChanges();

    expect(fixture.componentInstance.currentAnswersService.state).toBe(PaymentTypes.budget);
    expect(fixture.componentInstance.currentAnswersService.isValid).toBeTruthy();

    expect(setStateMock).toHaveBeenCalledTimes(2);
    expect(setStateMock).toHaveBeenNthCalledWith(1, PaymentTypes.budget);
    expect(setStateMock).toHaveBeenNthCalledWith(2, PaymentTypes.budget);
  });
});
