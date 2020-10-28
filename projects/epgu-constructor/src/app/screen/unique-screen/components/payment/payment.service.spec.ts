import { TestBed } from '@angular/core/testing';
import { PaymentService } from './payment.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConfigService } from '../../../../config/config.service';
import { ConfigServiceStub } from '../../../../config/config.service.stub';
import { DictionaryApiService } from '../../../services/dictionary-api/dictionary-api.service';
import { ScreenService } from '../../../screen.service';
import { UnsubscribeService } from '../../../../services/unsubscribe/unsubscribe.service';
import { FormPlayerApiService } from '../../../../services/form-player-api/form-player-api.service';
import { CurrentAnswersService } from '../../../current-answers.service';
import { CachedAnswersService } from '../../../../shared/services/applicant-answers/cached-answers.service';

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
        CachedAnswersService,
        CurrentAnswersService,
        FormPlayerApiService,
        ScreenService,
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
