
// Новый способ оплаты
import { ComponentDto } from '../../../../../../form-player/services/form-player-api/form-player-api.types';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ScreenService } from '../../../../../../screen/screen.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MockProvider } from 'ng-mocks';
import { PaymentService } from '../../payment.service';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { ConfigService } from '../../../../../../core/services/config/config.service';
import { LocationService } from '../../../../../../core/services/location/location.service';
import { LocalStorageService } from '../../../../../../core/services/local-storage/local-storage.service';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';
import { BillInfoComponent } from './billinfo.component';
import { EventBusService } from '../../../../../../form-player/services/event-bus/event-bus.service';

const mockData: ComponentDto = {
  attrs: {},
  id: 'pay1ms1',
  label: 'Страница оплаты счета',
  required: true,
  type: 'BillInfo',
  // eslint-disable-next-line max-len
  value: '{"billNumber":1232134,"billId":345453,"amount":750,"billName":"Оплата транспортного средства","billDate":"2020-12-24T17:06:42.266Z","payCode":1}'
};

describe('BillInfoComponent', () => {
  let component: BillInfoComponent;
  let fixture: ComponentFixture<BillInfoComponent>;
  let screenService: ScreenService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      declarations: [BillInfoComponent],
      providers: [
        MockProvider(PaymentService),
        MockProvider(CurrentAnswersService),
        MockProvider(ConfigService),
        MockProvider(LocationService),
        MockProvider(LocalStorageService),
        { provide: ScreenService, useClass: ScreenServiceStub },
        EventBusService
      ],
    }).compileComponents();
    screenService = TestBed.inject(ScreenService);
  }));

  beforeEach(() => {
    screenService.component = mockData;
    screenService.header = '';
    screenService.submitLabel = '';
    fixture = TestBed.createComponent(BillInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create Bill Info', () => {
    expect(component).toBeTruthy();
  });
});
