import { TestBed } from '@angular/core/testing';

import { ValueLoaderService } from './value-loader.service';
import { CachedAnswersService } from '../cached-answers/cached-answers.service';
import { UtilsService } from '../../../core/services/utils/utils.service';

describe('ValueLoaderService', () => {
  let service: ValueLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CachedAnswersService, UtilsService, ValueLoaderService],
    });
    service = TestBed.inject(ValueLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
