import { TestBed } from '@angular/core/testing';
import { PaymentService } from './payment.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConfigService } from '../../../../core/config/config.service';
import { ConfigServiceStub } from '../../../../core/config/config.service.stub';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';
import { FormPlayerApiService } from '../../../../form-player/services/form-player-api/form-player-api.service';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { CachedAnswersService } from '../../../../shared/services/applicant-answers/cached-answers.service';
import { DictionaryApiService } from '../../../shared/services/dictionary-api/dictionary-api.service';
import { ScreenService } from '../../../../screen/screen.service';

describe('PaymentService', () => {
  let service: PaymentService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PaymentService,
        CachedAnswersService,
        CurrentAnswersService,
        FormPlayerApiService,
        UnsubscribeService,
        DictionaryApiService,
        ScreenService,
        { provide: ConfigService, useClass: ConfigServiceStub }
      ]
    });
    service = TestBed.inject(PaymentService);
    http = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
