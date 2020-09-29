import { TestBed } from '@angular/core/testing';

import { ScreenService } from './screen.service';
import { CurrentAnswersService } from './current-answers.service';
import { CachedAnswersService } from '../shared/services/applicant-answers/cached-answers.service';

describe('ScreenService', () => {
  let service: ScreenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ScreenService,
        CachedAnswersService,
        CurrentAnswersService
      ]
    });
    service = TestBed.inject(ScreenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
