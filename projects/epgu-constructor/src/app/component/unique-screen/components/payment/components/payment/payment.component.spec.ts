import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { AutocompleteApiService } from '../../../../../../core/services/autocomplete/autocomplete-api.service';
import { ConfigService } from '../../../../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../../../../core/services/config/config.service.stub';
import { DatesToolsService } from '../../../../../../core/services/dates-tools/dates-tools.service';
import { DeviceDetectorService } from '../../../../../../core/services/device-detector/device-detector.service';
import { EventBusService } from '../../../../../../core/services/event-bus/event-bus.service';
import { InitDataService } from '../../../../../../core/services/init-data/init-data.service';
import { LocalStorageService, LocalStorageServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { LocationService } from '../../../../../../core/services/location/location.service';
import { LoggerService } from '../../../../../../core/services/logger/logger.service';
import { NavigationModalService } from '../../../../../../core/services/navigation-modal/navigation-modal.service';
import { NavigationService } from '../../../../../../core/services/navigation/navigation.service';
import { UtilsService } from '../../../../../../core/services/utils/utils.service';
import { FormPlayerApiService } from '../../../../../../form-player/services/form-player-api/form-player-api.service';
import { ModalService } from '../../../../../../modal/modal.service';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';
import { ActionService } from '../../../../../../shared/directives/action/action.service';
import { HtmlRemoverService } from '../../../../../../shared/services/html-remover/html-remover.service';
import { PaymentService } from '../../payment.service';
import { PaymentComponent } from './payment.component';
import { configureTestSuite } from 'ng-bullet';
import { FormPlayerServiceStub } from '../../../../../../form-player/services/form-player/form-player.service.stub';
import { FormPlayerService } from '../../../../../../form-player/services/form-player/form-player.service';
import { WINDOW_PROVIDERS } from '../../../../../../core/providers/window.provider';
import { ComponentDto, DTOActionAction } from '@epgu/epgu-constructor-types';

let mockData: ComponentDto;

describe('PaymentComponent', () => {
  let component: PaymentComponent;
  let fixture: ComponentFixture<PaymentComponent>;
  let screenService: ScreenService;

  /**
   * Функция теста оплаты
   */
  const testFnc = () => {
    beforeEach(() => {
      screenService = TestBed.inject(ScreenService);
      screenService.component = mockData;
      screenService.header = '';
      screenService.buttons = [{ label: '', action: DTOActionAction.getNextStep }];
      fixture = TestBed.createComponent(PaymentComponent);
      component = fixture.componentInstance;
    });

    it('should create payment brak/razbrack', () => {
      expect(component).toBeTruthy();
    });
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      declarations: [PaymentComponent],
      imports: [HttpClientTestingModule],
      providers: [
        MockProvider(PaymentService),
        MockProvider(CurrentAnswersService),
        MockProvider(LocationService),
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: FormPlayerService, useClass: FormPlayerServiceStub },
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
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

  // Старый способ оплаты брак/разбрак
  mockData = {
    attrs: {
      nsi: 'fns_zgs_getpay_79272',
      dictItemCode: '01',
      ref: {
        fiasCode: 'ms1.value',
      },
    },
    id: 'pay1ms1',
    label: 'Оплата госпошлины',
    required: true,
    type: 'PaymentScr',
    value: '',
  };

  describe('PaymentComponent old type Brak/Razbrak', testFnc);

  // Новый способ оплаты
  mockData = {
    attrs: {},
    id: 'pay1ms1',
    label: 'Оплата госпошлины',
    required: true,
    type: 'PaymentScr',
    // eslint-disable-next-line max-len
    value:
      '{"billNumber":1232134,"billId":345453,"amount":750,"billName":"Оплата транспортного средства","billDate":"2020-12-24T17:06:42.266Z","payCode":1}',
  };

  describe('PaymentComponent new type for All', testFnc);
});
