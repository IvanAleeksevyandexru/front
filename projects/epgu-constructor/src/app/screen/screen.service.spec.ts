import { TestBed } from '@angular/core/testing';

import { ScreenService } from './screen.service';
import { CachedAnswersService } from '../shared/services/applicant-answers/cached-answers.service';
import { ComponentStateService } from '../services/component-state/component-state.service';

describe('ScreenService', () => {
  let service: ScreenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ScreenService,
        CachedAnswersService,
        ComponentStateService
      ]
    });
    service = TestBed.inject(ScreenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
