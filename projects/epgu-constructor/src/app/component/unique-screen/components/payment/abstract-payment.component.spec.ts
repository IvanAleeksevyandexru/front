import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbstractPaymentComponent } from './abstract-payment.component';
import { ScreenService } from '../../../../screen/screen.service';
import { DictionaryApiService } from '../../../../shared/services/dictionary/dictionary-api.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';
import { ActionService } from '../../../../shared/directives/action/action.service';
import { ActionServiceStub } from '../../../../shared/directives/action/action.service.stub';
import { PaymentService } from './payment.service';
import { PaymentServiceStub } from './payment.service.stub';
import { ConfigService } from '../../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../../core/services/config/config.service.stub';
import { LocationService } from '../../../../core/services/location/location.service';
import { LocationServiceStub } from '../../../../core/services/location/location.service.stub';
import { LocalStorageService } from '../../../../core/services/local-storage/local-storage.service';
import { LocalStorageServiceStub } from '../../../../core/services/local-storage/local-storage.service.stub';
import { DictionaryApiServiceStub } from '../../../../shared/services/dictionary/dictionary-api.service.stub';
import { DatesToolsService } from '../../../../core/services/dates-tools/dates-tools.service';
import { DatesToolsServiceStub } from '../../../../core/services/dates-tools/dates-tools.service.stub';

describe('AbstractPaymentComponent', () => {
  let component: AbstractPaymentComponent;
  let fixture: ComponentFixture<AbstractPaymentComponent>;
  let screenService: ScreenService;
  let dictionaryApiService: DictionaryApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AbstractPaymentComponent],
      imports: [],
      providers: [
        UnsubscribeService,
        CurrentAnswersService,
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
    fixture = TestBed.createComponent(AbstractPaymentComponent);
    component = fixture.componentInstance;
    screenService = TestBed.inject(ScreenService);
    dictionaryApiService = TestBed.inject(DictionaryApiService);
    screenService.component = {}

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('init$', () => {
    it('should be change data', () => {
      expect(component.isPaid).toBeTruthy();
      expect(component.inLoading).toBeTruthy();
      expect(component.data).toEqual({});
    });
  });
});
