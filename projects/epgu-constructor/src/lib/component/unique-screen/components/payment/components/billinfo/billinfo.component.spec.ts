// Новый способ оплаты
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { AutocompleteApiService } from '../../../../../../core/services/autocomplete/autocomplete-api.service';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { DatesToolsService } from '@epgu/epgu-constructor-ui-kit';
import { DeviceDetectorService } from '@epgu/epgu-constructor-ui-kit';
import { EventBusService } from '@epgu/epgu-constructor-ui-kit';
import { InitDataService } from '../../../../../../core/services/init-data/init-data.service';
import { LocalStorageService } from '@epgu/epgu-constructor-ui-kit';
import { LocationService, WINDOW_PROVIDERS } from '@epgu/epgu-constructor-ui-kit';
import { LoggerService } from '@epgu/epgu-constructor-ui-kit';
import { NavigationModalService } from '../../../../../../core/services/navigation-modal/navigation-modal.service';
import { NavigationService } from '../../../../../../core/services/navigation/navigation.service';
import { UtilsService } from '@epgu/epgu-constructor-ui-kit';
import { FormPlayerApiService } from '../../../../../../form-player/services/form-player-api/form-player-api.service';
import { ModalService } from '@epgu/epgu-constructor-ui-kit';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';
import { ActionService } from '../../../../../../shared/directives/action/action.service';
import { HtmlRemoverService } from '../../../../../../shared/services/html-remover/html-remover.service';
import { PaymentService } from '../../payment.service';
import { BillInfoComponent } from './billinfo.component';
import { configureTestSuite } from 'ng-bullet';
import { FormPlayerServiceStub } from '../../../../../../form-player/services/form-player/form-player.service.stub';
import { FormPlayerService } from '../../../../../../form-player/services/form-player/form-player.service';
import { ComponentDto } from '@epgu/epgu-constructor-types';

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
      imports: [HttpClientTestingModule, HttpClientTestingModule],
      providers: [
        MockProvider(PaymentService),
        MockProvider(CurrentAnswersService),
        MockProvider(ConfigService),
        MockProvider(LocationService),
        MockProvider(LocalStorageService),
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: FormPlayerService, useClass: FormPlayerServiceStub },
        EventBusService,
        DatesToolsService,
        ActionService,
        FormPlayerApiService,
        InitDataService,
        LoggerService,
        NavigationService,
        NavigationModalService,
        DeviceDetectorService,
        UtilsService,
        HtmlRemoverService,
        AutocompleteApiService,
        ModalService,
        WINDOW_PROVIDERS,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    screenService = TestBed.inject(ScreenService);
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