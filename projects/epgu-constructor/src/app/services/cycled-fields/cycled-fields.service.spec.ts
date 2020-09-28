import { TestBed } from '@angular/core/testing';

import { CycledFieldsService } from './cycled-fields.service';
import { ScreenService } from '../../screen/screen.service';
import { ApplicantAnswersService } from '../../shared/services/applicant-answers/applicant-answers.service';
import { CurrentAnswersService } from '../../screen/current-answers.service';

describe('CycledFieldsService', () => {
  let service: CycledFieldsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CycledFieldsService, ScreenService, ApplicantAnswersService, CurrentAnswersService]
    });
    service = TestBed.inject(CycledFieldsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
