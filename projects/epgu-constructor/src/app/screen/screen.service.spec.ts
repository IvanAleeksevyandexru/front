import { TestBed } from '@angular/core/testing';
import { CachedAnswersService } from '../shared/services/applicant-answers/cached-answers.service';
import { UtilsService } from '../shared/services/utils/utils.service';
import { CurrentAnswersService } from './current-answers.service';
import { ScreenService } from './screen.service';


describe('ScreenService', () => {
  let service: ScreenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ScreenService,
        CachedAnswersService,
        CurrentAnswersService,
        UtilsService,
      ]
    });
    service = TestBed.inject(ScreenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
