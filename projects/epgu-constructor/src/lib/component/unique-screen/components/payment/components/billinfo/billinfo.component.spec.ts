// Новый способ оплаты
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { DatesToolsService } from '@epgu/epgu-constructor-ui-kit';
import { LocalStorageService } from '@epgu/epgu-constructor-ui-kit';
import { LocationService } from '@epgu/epgu-constructor-ui-kit';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';
import { ActionService } from '../../../../../../shared/directives/action/action.service';
import { PaymentService } from '../../payment.service';
import { BillInfoComponent } from './billinfo.component';
import { configureTestSuite } from 'ng-bullet';
import { ComponentDto } from '@epgu/epgu-constructor-types';
import { ActionServiceStub } from '../../../../../../shared/directives/action/action.service.stub';
import { PriorPrefixModule } from '../../../../../../shared/pipes/prior-prefix/prior-prefix.module';

const mockData: ComponentDto = {
  attrs: {},
  id: 'pay1ms1',
  label: 'Страница оплаты счета',
  required: true,
  type: 'BillInfo',
  // eslint-disable-next-line max-len
  value:
    '{"billNumber":1232134,"billId":345453,"amount":750,"billName":"Оплата транспортного средства","billDate":"2020-12-24T17:06:42.266Z","payCode":1}',
};

describe('BillInfoComponent', () => {
  let component: BillInfoComponent;
  let fixture: ComponentFixture<BillInfoComponent>;
  let screenService: ScreenService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      declarations: [BillInfoComponent],
      imports: [HttpClientTestingModule, HttpClientTestingModule, PriorPrefixModule],
      providers: [
        MockProvider(PaymentService),
        MockProvider(CurrentAnswersService),
        MockProvider(ConfigService),
        MockProvider(LocationService),
        MockProvider(LocalStorageService),
        MockProvider(DatesToolsService),
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ActionService, useClass: ActionServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    screenService = TestBed.inject(ScreenService);
    screenService.component = mockData;
    screenService.header = '';
    screenService.buttons = [];
    fixture = TestBed.createComponent(BillInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create Bill Info', () => {
    expect(component).toBeTruthy();
  });
});
