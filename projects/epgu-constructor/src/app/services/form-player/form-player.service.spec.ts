import { TestBed } from '@angular/core/testing';

import { FormPlayerService } from './form-player.service';
import { ScreenService } from '../../screen/screen.service';
import { FormPlayerApiService } from '../api/form-player-api/form-player-api.service';
import { FormPlayerApiServiceStub } from '../api/form-player-api/form-player-api.service.stub';
import { CachedAnswersService } from '../../shared/services/applicant-answers/cached-answers.service';
import { CurrentAnswersService } from '../../screen/current-answers.service';
import { ServiceDataService } from '../service-data/service-data.service';

describe('FormPlayerService', () => {
  let service: FormPlayerService;
  let formPlayerApiService: FormPlayerApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FormPlayerService,
        ScreenService,
        ServiceDataService,
        CachedAnswersService,
        CurrentAnswersService,
        { provide: FormPlayerApiService, useClass: FormPlayerApiServiceStub },
      ]
    });
    service = TestBed.inject(FormPlayerService);
    formPlayerApiService = TestBed.inject(FormPlayerApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
