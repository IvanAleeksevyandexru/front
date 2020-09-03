import { TestBed } from '@angular/core/testing';
import { PaymentService } from './payment.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConstructorConfigService } from '../../../../services/config/constructor-config.service';
import { ConstructorConfigServiceStub } from '../../../../services/config/constructor-config.service.stub';
import { DictionaryApiService } from '../../../../services/api/dictionary-api/dictionary-api.service';
import { ScreenService } from '../../../screen.service';
import { ComponentStateService } from '../../../../services/component-state/component-state.service';
import { FormPlayerService } from '../../../../services/form-player/form-player.service';
import { UserSessionService } from '../../../../services/user-session/user-session.service';

describe('PaymentService', () => {
  let service: PaymentService;
  let dictionaryApiService: DictionaryApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DictionaryApiService,
        PaymentService,
        UserSessionService,
        ScreenService,
        ConstructorConfigService,
        ComponentStateService,
        FormPlayerService,
        { provide: ConstructorConfigService, useClass: ConstructorConfigServiceStub }
      ]
    });
    service = TestBed.inject(PaymentService);
    dictionaryApiService = TestBed.inject(DictionaryApiService);
    http = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
