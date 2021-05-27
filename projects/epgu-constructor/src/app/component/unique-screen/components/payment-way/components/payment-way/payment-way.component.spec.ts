import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { configureTestSuite } from 'ng-bullet';
import { MockComponents, MockModule } from 'ng-mocks';
import { EpguLibModule } from '@epgu/epgu-lib';
import { PaymentWayComponent } from './payment-way.component';
import { OutputHtmlComponent } from '../../../../../../shared/components/output-html/output-html.component';
import { PaymentTypes } from '../../payment-way.types';

const mockComponents = {
  label: '',
  attrs: {
    paymentWay: [
      {
        paymentType: PaymentTypes.certificate,
        amount: '1230000',
        programType: null
      },
      {
        paymentType: PaymentTypes.purse,
        amount: '12300000',
        programType: null
      },
      {
        paymentType: PaymentTypes.free,
        amount: null,
        programType: 'Профессиональная',
      }
    ],
    paymentInfo: {
      free: 'fake free hint',
      certificate: 'fake certificate hint'
    }
  }
};

describe('PaymentWayComponent', () => {
  let component: PaymentWayComponent;
  let fixture: ComponentFixture<PaymentWayComponent>;

  configureTestSuite(  () => {
    TestBed.configureTestingModule({
      declarations: [PaymentWayComponent,  MockComponents(OutputHtmlComponent)],
      imports: [MockModule(EpguLibModule)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentWayComponent);
    component = fixture.componentInstance;
    component.component = mockComponents as any;
    component.paymentControl = new FormControl();
    component.ngOnChanges();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
