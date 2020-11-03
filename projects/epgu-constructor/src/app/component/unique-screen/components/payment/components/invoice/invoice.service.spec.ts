import { TestBed } from '@angular/core/testing';
import { InvoiceService } from './invoice.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConfigService } from '../../../../../../core/config/config.service';
import { ConfigServiceStub } from '../../../../../../core/config/config.service.stub';
import { DictionaryApiService } from '../../../../../shared/services/dictionary-api/dictionary-api.service';
import { ScreenService } from '../../../../../../screen/screen.service';
import { UnsubscribeService } from '../../../../../../core/services/unsubscribe/unsubscribe.service';
import { FormPlayerApiService } from '../../../../../../form-player/services/form-player-api/form-player-api.service';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { CachedAnswersService } from '../../../../../../shared/services/applicant-answers/cached-answers.service';
import { PaymentService } from '../../payment.service';

describe('InvoiceService', () => {
  let service: InvoiceService;
  let dictionaryApiService: DictionaryApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DictionaryApiService,
        InvoiceService,
        PaymentService,
        CachedAnswersService,
        CurrentAnswersService,
        FormPlayerApiService,
        ScreenService,
        UnsubscribeService,
        { provide: ConfigService, useClass: ConfigServiceStub }
      ]
    });
    service = TestBed.inject(InvoiceService);
    dictionaryApiService = TestBed.inject(DictionaryApiService);
    http = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
