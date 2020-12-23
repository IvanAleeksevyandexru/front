import { PaymentComponent } from './payment.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentBase } from '../../../../../../screen/screen.types';
import { RouterTestingModule } from '@angular/router/testing';
import { ScreenService } from '../../../../../../screen/screen.service';
import { of, Subject } from 'rxjs';
import { PaymentService } from '../../payment.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FileUploadScreenComponent } from '../../../file-upload-screen/file-upload-screen.component';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';


class MockScreenService {
  header = 'Оплата пошлины';
  display = {
    components: [],
  };
  isLoading = new Subject().asObservable();
  orderId = 1;
}

describe('PaymentComponent', () => {
  let component: PaymentComponent;
  let fixture: ComponentFixture<PaymentComponent>;
  let mockDataOldType: ComponentBase = {
    attrs: {
      nsi: 'fns_zgs_getpay_79272',
      dictItemCode: '01',
        ref: {
          fiasCode: 'ms1.value'
        },
      },
    id: 'pay1ms1',
    label: 'Регистрация расторжения брака',
    required: true,
    type: 'PaymentScr',
    value: ''
  };

  let screenService: ScreenService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      declarations: [FileUploadScreenComponent],
      providers: [{ provide: ScreenService, useClass: ScreenServiceStub }],
    }).compileComponents();
    screenService = TestBed.inject(ScreenService);
  }));

  beforeEach(() => {
    screenService.component$ = of(mockDataOldType);
    screenService.header$ = of('');
    screenService.submitLabel$ = of('');
    fixture = TestBed.createComponent(PaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
