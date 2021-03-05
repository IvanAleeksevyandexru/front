import { TestBed } from '@angular/core/testing';

import { ComponentListToolsService } from './component-list-tools.service';
import { DateRangeService } from '../date-range/date-range.service';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { DatesToolsService } from '../../../core/services/dates-tools/dates-tools.service';
import { DictionaryToolsService } from '../dictionary/dictionary-tools.service';

describe('ComponentListToolsService', () => {
  let service: ComponentListToolsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ComponentListToolsService,
        DateRangeService,
        DatesToolsService,
        { provide: ScreenService, useClass: ScreenServiceStub },
        DictionaryToolsService,
      ],
    });
    service = TestBed.inject(ComponentListToolsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
