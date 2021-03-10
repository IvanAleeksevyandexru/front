import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { DurationService } from './duration.service';
import { DatesToolsService } from '../../../../../core/services/dates-tools/dates-tools.service';
import { ValidationService } from '../../../../../shared/services/validation/validation.service';
import { ScreenService } from '../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../screen/screen.service.stub';
import { DateRangeService } from '../../../../../shared/services/date-range/date-range.service';

describe('DurationService', () => {
  let service: DurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DurationService,
        DatesToolsService,
        ValidationService,
        DateRangeService,
        { provide: ScreenService, use: ScreenServiceStub },
      ],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(DurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
