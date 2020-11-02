import { TestBed } from '@angular/core/testing';

import { ScreenModalService } from './screen-modal.service';
import { FormPlayerApiService } from '../../form-player/services/form-player-api/form-player-api.service';
import { ScreenService } from '../../screen/screen.service';
import { ServiceDataService } from '../../form-player/services/service-data/service-data.service';
import { CachedAnswersService } from '../../shared/services/applicant-answers/cached-answers.service';
import { CurrentAnswersService } from '../../screen/current-answers.service';
import { FormPlayerApiServiceStub } from '../../form-player/services/form-player-api/form-player-api.service.stub';


describe('ScreenModalService', () => {
  let service: ScreenModalService;
  let formPlayerApiService: FormPlayerApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ScreenModalService,
        ScreenService,
        ServiceDataService,
        CachedAnswersService,
        CurrentAnswersService,
        { provide: FormPlayerApiService, useClass: FormPlayerApiServiceStub },
      ]
    });
    service = TestBed.inject(ScreenModalService);
    formPlayerApiService = TestBed.inject(FormPlayerApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
