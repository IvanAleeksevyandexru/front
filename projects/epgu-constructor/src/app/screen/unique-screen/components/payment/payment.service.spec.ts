import { TestBed } from '@angular/core/testing';
import { PaymentService } from './payment.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConfigService } from '../../../../config/config.service';
import { ConfigServiceStub } from '../../../../config/config.service.stub';
import { DictionaryApiService } from '../../../../services/api/dictionary-api/dictionary-api.service';
import { ScreenService } from '../../../screen.service';
import { UnsubscribeService } from '../../../../services/unsubscribe/unsubscribe.service';
import { FormPlayerApiService } from '../../../../services/api/form-player-api/form-player-api.service';
import { ApplicantAnswersService } from '../../../../shared/services/applicant-answers/applicant-answers.service';
import { ComponentStateService } from '../../../component-state.service';

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
        ApplicantAnswersService,
        ComponentStateService,
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
