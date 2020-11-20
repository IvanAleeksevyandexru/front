import { TestBed } from '@angular/core/testing';

import { ScreenModalService } from './screen-modal.service';
import { FormPlayerApiService } from '../../form-player/services/form-player-api/form-player-api.service';
import { ScreenService } from '../../screen/screen.service';
import { FormPlayerApiServiceStub } from '../../form-player/services/form-player-api/form-player-api.service.stub';
import { FormPlayerServiceStub } from '../../form-player/services/form-player/form-player.service.stub';
import { FormPlayerService } from '../../form-player/services/form-player/form-player.service';
import { ScreenServiceStub } from '../../screen/screen.service.stub';
import { LoggerService } from '../../core/services/logger/logger.service';
import { LoggerServiceStub } from '../../core/services/logger/logger.service.stub';


describe('ScreenModalService', () => {
  let service: ScreenModalService;
  let formPlayerApiService: FormPlayerApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ScreenModalService,
        ScreenService,
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: FormPlayerService, useClass: FormPlayerServiceStub },
        { provide: FormPlayerApiService, useClass: FormPlayerApiServiceStub },
        { provide: LoggerService, useClass: LoggerServiceStub },
      ]
    });
    service = TestBed.inject(ScreenModalService);
    formPlayerApiService = TestBed.inject(FormPlayerApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
