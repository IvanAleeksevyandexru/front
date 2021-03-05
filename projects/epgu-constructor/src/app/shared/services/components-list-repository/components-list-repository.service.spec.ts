import { TestBed } from '@angular/core/testing';

import { ComponentsListRepositoryService } from './components-list-repository.service';
import { DictionaryApiService } from '../dictionary/dictionary-api.service';
import { DictionaryApiServiceStub } from '../dictionary/dictionary-api.service.stub';
import { ComponentsListToolsService } from '../components-list-tools/components-list-tools.service';
import { DateRangeService } from '../date-range/date-range.service';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { DatesToolsService } from '../../../core/services/dates-tools/dates-tools.service';
import { DictionaryToolsService } from '../dictionary/dictionary-tools.service';

describe('ComponentsListRepositoryService', () => {
  let service: ComponentsListRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ComponentsListRepositoryService,
        ComponentsListToolsService,
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
        DateRangeService,
        DatesToolsService,
        { provide: ScreenService, useClass: ScreenServiceStub },
        DictionaryToolsService,
      ],
    });
    service = TestBed.inject(ComponentsListRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
