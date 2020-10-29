import { inject, TestBed } from '@angular/core/testing';

import { ActionDirective } from './action.directive';
import { ConfigService } from '../../../core/config/config.service';
import { ConfigServiceStub } from '../../../core/config/config.service.stub';
import { NavigationService } from '../../services/navigation/navigation.service';
import { UtilsService } from '../../services/utils/utils.service';
import { CurrentAnswersService } from '../../../screen/current-answers.service';
import { ScreenService } from '../../../screen/screen.service';
import { CachedAnswersService } from '../../services/applicant-answers/cached-answers.service';
import { DeviceDetectorService } from '../../services/device-detector/device-detector.service';
import { DeviceDetectorServiceStub } from '../../services/device-detector/device-detector.service.stub';
import { FormPlayerApiService } from '../../../form-player/services/form-player-api/form-player-api.service';
import { FormPlayerApiServiceStub } from '../../../form-player/services/form-player-api/form-player-api.service.stub';

describe('ActionDirective', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActionDirective],
      providers: [
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: FormPlayerApiService, useClass: FormPlayerApiServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        NavigationService,
        UtilsService,
        ScreenService,
        CachedAnswersService,
        CurrentAnswersService,
      ],
    });
  });

  it('should create an instance', inject(
    [FormPlayerApiService, UtilsService, ScreenService, NavigationService],
    (
      formPlayerApiService: FormPlayerApiService,
      utilsService: UtilsService,
      screenService: ScreenService,
      navigationService: NavigationService,
    ) => {
      const directive = new ActionDirective(
        formPlayerApiService,
        screenService,
        navigationService,
        utilsService,
      );

      expect(directive).toBeTruthy();
    },
  ));
});
