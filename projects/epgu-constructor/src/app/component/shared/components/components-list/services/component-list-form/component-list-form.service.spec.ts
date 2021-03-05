import { TestBed } from '@angular/core/testing';

import { ComponentListFormService } from './component-list-form.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ValidationService } from '../../../../../../shared/services/validation/validation.service';
import { UnsubscribeService } from '../../../../../../core/services/unsubscribe/unsubscribe.service';
import { ComponentListToolsService } from '../component-list-tools/component-list-tools.service';
import { AddressHelperService } from '../../../../../../core/services/address-helper/address-helper.service';
import { DictionaryApiService } from '../../../../../../core/services/dictionary/dictionary-api.service';
// eslint-disable-next-line max-len
import { DictionaryApiServiceStub } from 'projects/epgu-constructor/src/app/core/services/dictionary/dictionary-api.service.stub';
import { ComponentListRepositoryService } from '../component-list-repository/component-list-repository.service';
import { LoggerService } from '../../../../../../core/services/logger/logger.service';
import { DateRangeService } from '../../../../../../core/services/date-range/date-range.service';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';
import { DatesToolsService } from '../../../../../../core/services/dates-tools/dates-tools.service';
import { DictionaryToolsService } from '../../../../../../core/services/dictionary/dictionary-tools.service';

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
