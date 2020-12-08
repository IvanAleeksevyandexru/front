import { TestBed } from '@angular/core/testing';
import { CachedAnswersService } from '../../../shared/services/applicant-answers/cached-answers.service';
import { UtilsService } from '../../../shared/services/utils/utils.service';
import { CurrentAnswersService } from '../../current-answers.service';
import { ScreenService } from '../../screen.service';
import { CycledFieldsService } from './cycled-fields.service';


describe('CycledFieldsService', () => {
  let service: CycledFieldsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CycledFieldsService, ScreenService, CachedAnswersService, CurrentAnswersService, UtilsService]
    });
    service = TestBed.inject(CycledFieldsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
