import { TestBed } from '@angular/core/testing';
import { ComponentsListFormService } from './components-list-form.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ValidationService } from '../validation/validation.service';
import { UnsubscribeService } from '../../../core/services/unsubscribe/unsubscribe.service';
import { ComponentsListToolsService } from '../components-list-tools/components-list-tools.service';
import { AddressHelperService } from '../address-helper/address-helper.service';
import { DictionaryApiService } from '../dictionary/dictionary-api.service';
import { DictionaryApiServiceStub } from 'projects/epgu-constructor/src/app/shared/services/dictionary/dictionary-api.service.stub';
import { LoggerService } from '../../../core/services/logger/logger.service';
import { DateRangeService } from '../date-range/date-range.service';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { DatesToolsService } from '../../../core/services/dates-tools/dates-tools.service';
import { DictionaryToolsService } from '../dictionary/dictionary-tools.service';
import { ComponentsListRelationsService } from '../components-list-relations/components-list-relations.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ComponentsListFormService', () => {
  let service: ComponentsListFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        ComponentsListFormService,
        ValidationService,
        UnsubscribeService,
        ComponentsListToolsService,
        AddressHelperService,
        LoggerService,
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
        DateRangeService,
        DatesToolsService,
        { provide: ScreenService, useClass: ScreenServiceStub },
        DictionaryToolsService,
        ComponentsListRelationsService,
      ],
    });
    service = TestBed.inject(ComponentsListFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
