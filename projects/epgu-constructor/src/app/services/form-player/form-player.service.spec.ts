import { TestBed } from '@angular/core/testing';

import { FormPlayerService } from './form-player.service';
import { ScreenService } from '../../screen/screen.service';
import { FormPlayerApiService } from '../api/form-player-api/form-player-api.service';
import { FormPlayerApiServiceStub } from '../api/form-player-api/form-player-api.service.stub';
import { ApplicantAnswersService } from '../../shared/services/applicant-answers/applicant-answers.service';
import { ScreenResolverService } from '../screen-resolver/screen-resolver.service';
import { ComponentStateService } from '../component-state/component-state.service';
import { ServiceDataService } from '../service-data/service-data.service';
import { CookieService } from 'ngx-cookie-service';
import { ConfigService } from '../../config/config.service';

describe('FormPlayerService', () => {
  let service: FormPlayerService;
  let formPlayerApiService: FormPlayerApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FormPlayerService,
        ScreenService,
        ServiceDataService,
        ApplicantAnswersService,
        ComponentStateService,
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
