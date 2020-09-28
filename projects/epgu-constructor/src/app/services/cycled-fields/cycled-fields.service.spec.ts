import { TestBed } from '@angular/core/testing';

import { CycledFieldsService } from './cycled-fields.service';
import { ScreenService } from '../../screen/screen.service';
import { ApplicantAnswersService } from '../../shared/services/applicant-answers/applicant-answers.service';
import { ComponentStateService } from '../../screen/component-state.service';

describe('CycledFieldsService', () => {
  let service: CycledFieldsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CycledFieldsService, ScreenService, ApplicantAnswersService, ComponentStateService]
    });
    service = TestBed.inject(CycledFieldsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
