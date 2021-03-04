import { TestBed } from '@angular/core/testing';

import { ComponentListRepositoryService } from './component-list-repository.service';
import { DictionaryApiService } from '../../../../services/dictionary/dictionary-api.service';
import { DictionaryApiServiceStub } from '../../../../services/dictionary/dictionary-api.service.stub';
import { ComponentListToolsService } from '../component-list-tools/component-list-tools.service';
import { DateRangeService } from '../date-range/date-range.service';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';
import { DatesToolsService } from '../../../../../../core/services/dates-tools/dates-tools.service';
import { DictionaryToolsService } from '../../../../services/dictionary/dictionary-tools.service';

describe('ComponentListRepositoryService', () => {
  let service: ComponentListRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ComponentListRepositoryService,
        ComponentListToolsService,
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
        DateRangeService,
        DatesToolsService,
        { provide: ScreenService, useClass: ScreenServiceStub },
        DictionaryToolsService,
      ],
    });
    service = TestBed.inject(ComponentListRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
