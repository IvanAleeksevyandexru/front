import { TestBed } from '@angular/core/testing';

import { CachedAnswersService } from './cached-answers.service';

describe('ApplicantAnswersService', () => {
  let service: CachedAnswersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CachedAnswersService,
      ]
    });
    service = TestBed.inject(CachedAnswersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
