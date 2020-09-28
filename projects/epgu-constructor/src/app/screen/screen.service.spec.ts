import { TestBed } from '@angular/core/testing';

import { ScreenService } from './screen.service';
import { ApplicantAnswersService } from '../shared/services/applicant-answers/applicant-answers.service';
import { ComponentStateService } from '../components/component-state.service';

describe('ScreenService', () => {
  let service: ScreenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ScreenService,
        ApplicantAnswersService,
        ComponentStateService
      ]
    });
    service = TestBed.inject(ScreenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
