import { TestBed } from '@angular/core/testing';

import { ComponentListFormService } from './component-list-form.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ValidationService } from '../validation/validation.service';
import { UnsubscribeService } from '../../../core/services/unsubscribe/unsubscribe.service';
import { ComponentListToolsService } from '../component-list-tools/component-list-tools.service';
import { AddressHelperService } from '../address-helper/address-helper.service';
import { DictionaryApiService } from '../dictionary/dictionary-api.service';
// eslint-disable-next-line max-len
import { DictionaryApiServiceStub } from 'projects/epgu-constructor/src/app/shared/services/dictionary/dictionary-api.service.stub';
import { ComponentListRepositoryService } from '../component-list-repository/component-list-repository.service';
import { LoggerService } from '../../../core/services/logger/logger.service';
import { DateRangeService } from '../date-range/date-range.service';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { DatesToolsService } from '../../../core/services/dates-tools/dates-tools.service';
import { DictionaryToolsService } from '../dictionary/dictionary-tools.service';

describe('ComponentListFormService', () => {
  let service: ComponentListFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        ComponentListFormService,
        ValidationService,
        UnsubscribeService,
        ComponentListToolsService,
        AddressHelperService,
        ComponentListRepositoryService,
        LoggerService,
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
        DateRangeService,
        DatesToolsService,
        { provide: ScreenService, useClass: ScreenServiceStub },
        DictionaryToolsService,
      ],
    });
    service = TestBed.inject(ComponentListFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
