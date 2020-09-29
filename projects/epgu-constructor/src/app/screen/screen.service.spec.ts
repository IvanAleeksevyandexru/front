import { TestBed } from '@angular/core/testing';

import { ScreenService } from './screen.service';
import { ApplicantAnswersService } from '../shared/services/applicant-answers/applicant-answers.service';
import { CurrentAnswersService } from './current-answers.service';

describe('ScreenService', () => {
  let service: ScreenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ScreenService,
        ApplicantAnswersService,
        CurrentAnswersService
      ]
    });
    service = TestBed.inject(ScreenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
