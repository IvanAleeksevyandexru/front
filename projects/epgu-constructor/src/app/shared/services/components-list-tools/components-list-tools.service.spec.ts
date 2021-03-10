import { TestBed } from '@angular/core/testing';
import { ComponentsListToolsService } from './components-list-tools.service';
import { DateRangeService } from '../date-range/date-range.service';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { DatesToolsService } from '../../../core/services/dates-tools/dates-tools.service';
import { DictionaryToolsService } from '../dictionary/dictionary-tools.service';

describe('ComponentsListToolsService', () => {
  let service: ComponentsListToolsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ComponentsListToolsService,
        DateRangeService,
        DatesToolsService,
        { provide: ScreenService, useClass: ScreenServiceStub },
        DictionaryToolsService,
      ],
    });
    service = TestBed.inject(ComponentsListToolsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
