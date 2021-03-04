import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfigService } from '../../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../../core/services/config/config.service.stub';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';
import { FormPlayerApiService } from '../../../../form-player/services/form-player-api/form-player-api.service';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ScreenService } from '../../../../screen/screen.service';
import { CachedAnswersService } from '../../../../shared/services/cached-answers/cached-answers.service';
import { UtilsService } from '../../../../core/services/utils/utils.service';
import { DictionaryApiService } from '../../../shared/services/dictionary/dictionary-api.service';
import { PaymentService } from './payment.service';
import { ValueLoaderService } from '../../../../shared/services/value-loader/value-loader.service';
import { LocationService } from '../../../../core/services/location/location.service';
import { WINDOW_PROVIDERS } from '../../../../core/providers/window.provider';
import { DatesToolsService } from '../../../../core/services/dates-tools/dates-tools.service';
import { DictionaryToolsService } from '../../../shared/services/dictionary/dictionary-tools.service';

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
        UtilsService,
        LocationService,
        WINDOW_PROVIDERS,
        { provide: ConfigService, useClass: ConfigServiceStub },
        ValueLoaderService,
        DatesToolsService,
        DictionaryToolsService,
      ],
    });
    service = TestBed.inject(PaymentService);
    http = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
