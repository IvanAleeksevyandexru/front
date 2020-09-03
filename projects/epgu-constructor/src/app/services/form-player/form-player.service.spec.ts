import { TestBed } from '@angular/core/testing';

import { FormPlayerService } from './form-player.service';
import { ComponentStateService } from '../component-state/component-state.service';
import { ScreenService } from '../../screen/screen.service';
import { FormPlayerApiService } from '../form-player-api/form-player-api.service';
import { FormPlayerApiServiceStub } from '../form-player-api/form-player-api.service.stub';
import { CookieService } from 'ngx-cookie-service';

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
