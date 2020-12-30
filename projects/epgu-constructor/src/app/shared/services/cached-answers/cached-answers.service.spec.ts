import { TestBed } from '@angular/core/testing';

import { CachedAnswersService } from './cached-answers.service';
import { UtilsService } from '../../../core/services/utils/utils.service';

describe('CachedAnswersService', () => {
  let service: CachedAnswersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CachedAnswersService,
        UtilsService
      ]
    });
    service = TestBed.inject(CachedAnswersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
