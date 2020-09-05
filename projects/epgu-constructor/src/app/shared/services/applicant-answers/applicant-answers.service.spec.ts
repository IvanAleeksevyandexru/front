import { TestBed } from '@angular/core/testing';

import { ApplicantAnswersService } from './applicant-answers.service';

describe('ApplicantAnswersService', () => {
  let service: ApplicantAnswersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ApplicantAnswersService,
      ]
    });
    service = TestBed.inject(ApplicantAnswersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
