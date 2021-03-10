
// Новый способ оплаты
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { ConfigService } from '../../../../../../core/services/config/config.service';
import { DatesToolsService } from '../../../../../../core/services/dates-tools/dates-tools.service';
import { EventBusService } from '../../../../../../core/services/event-bus/event-bus.service';
import { LocalStorageService } from '../../../../../../core/services/local-storage/local-storage.service';
import { LocationService } from '../../../../../../core/services/location/location.service';
import { ComponentDto } from '../../../../../../form-player/services/form-player-api/form-player-api.types';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';
import { PaymentService } from '../../payment.service';
import { BillInfoComponent } from './billinfo.component';

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
      imports: [
        HttpClientTestingModule,
        HttpClientTestingModule,
      ],
      providers: [
        MockProvider(PaymentService),
        MockProvider(CurrentAnswersService),
        MockProvider(ConfigService),
        MockProvider(LocationService),
        MockProvider(LocalStorageService),
        { provide: ScreenService, useClass: ScreenServiceStub },
        EventBusService,
        DatesToolsService,
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
