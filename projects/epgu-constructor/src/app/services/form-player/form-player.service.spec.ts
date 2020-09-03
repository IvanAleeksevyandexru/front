import { TestBed } from '@angular/core/testing';
import { CookieService } from 'ngx-cookie-service';

import { FormPlayerService } from './form-player.service';
import { ComponentStateService } from '../component-state/component-state.service';
import { ScreenService } from '../../screen/screen.service';
import { FormPlayerApiService } from '../api/form-player-api/form-player-api.service';
import { FormPlayerApiServiceStub } from '../api/form-player-api/form-player-api.service.stub';
import { ScreenResolverService } from '../screen-resolver/screen-resolver.service';

describe('FormPlayerService', () => {
  let service: FormPlayerService;
  let apiService: FormPlayerApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FormPlayerService,
        ComponentStateService,
        ScreenService,
        CookieService,
        ScreenResolverService,
        { provide: FormPlayerApiService, useClass: FormPlayerApiServiceStub },
      ]
    });
    service = TestBed.inject(FormPlayerService);
    apiService = TestBed.inject(FormPlayerApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
