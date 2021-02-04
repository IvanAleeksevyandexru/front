import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ModalService } from '../../../modal/modal.service';
import { CurrentAnswersService } from '../../../screen/current-answers.service';
import { ScreenService } from '../../../screen/screen.service';
import { CachedAnswersService } from '../../../shared/services/cached-answers/cached-answers.service';
import { ValueLoaderService } from '../../../shared/services/value-loader/value-loader.service';
import { ConfigService } from '../config/config.service';
import { ConfigServiceStub } from '../config/config.service.stub';
import { DatesToolsService } from '../dates-tools/dates-tools.service';
import { EventBusService } from '../event-bus/event-bus.service';
import { UnsubscribeService } from '../unsubscribe/unsubscribe.service';
import { UtilsService } from '../utils/utils.service';
import { AutocompleteApiService } from './autocomplete-api.service';
import { AutocompleteService } from './autocomplete.service';

describe('AutocompleteService', () => {
  let service: AutocompleteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpClient,
        { provide: ConfigService, useClass: ConfigServiceStub },
        ScreenService,
        UnsubscribeService,
        AutocompleteService,
        AutocompleteApiService,
        HttpHandler,
        CurrentAnswersService,
        ValueLoaderService,
        CachedAnswersService,
        UtilsService,
        DatesToolsService,
        EventBusService,
        ModalService,
      ]
    });
    service = TestBed.inject(AutocompleteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
