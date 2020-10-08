import { TestBed } from '@angular/core/testing';

import { CurrentAnswersService } from './current-answers.service';

describe('CurrentAnswersService', () => {
  let service: CurrentAnswersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CurrentAnswersService]
    });
    service = TestBed.inject(CurrentAnswersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
