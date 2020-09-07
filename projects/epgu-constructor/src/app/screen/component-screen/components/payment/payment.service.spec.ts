import { TestBed } from '@angular/core/testing';
import { PaymentService } from './payment.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConfigService } from '../../../../config/config.service';
import { ConfigServiceStub } from '../../../../config/config.service.stub';
import { DictionaryApiService } from '../../../../services/api/dictionary-api/dictionary-api.service';
import { ScreenService } from '../../../screen.service';
import { FormPlayerService } from '../../../../services/form-player/form-player.service';
import { UnsubscribeService } from '../../../../services/unsubscribe/unsubscribe.service';
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
        UserSessionService,
        PaymentService,
        FormPlayerService,
        ScreenService,
        ConfigService,
        UnsubscribeService,
        { provide: ConfigService, useClass: ConfigServiceStub }
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
