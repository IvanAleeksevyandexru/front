import { TestBed } from '@angular/core/testing';

import { CycledFieldsService } from './cycled-fields.service';
import { ScreenService } from '../../screen/screen.service';
import { CachedAnswersService } from '../../shared/services/applicant-answers/cached-answers.service';
import { ComponentStateService } from '../component-state/component-state.service';

describe('CycledFieldsService', () => {
  let service: CycledFieldsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CycledFieldsService, ScreenService, CachedAnswersService, ComponentStateService]
    });
    service = TestBed.inject(CycledFieldsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
