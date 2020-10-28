import { inject, TestBed } from '@angular/core/testing';

import { ActionDirective } from './action.directive';
import { ConfigService } from '../../../config/config.service';
import { ConfigServiceStub } from '../../../config/config.service.stub';
import { ActionApiService } from '../../../services/api/action-api/action-api.service';
import { ActionApiServiceStub } from '../../../services/api/action-api/action-api.service.stub';
import { NavigationService } from '../../services/navigation/navigation.service';
import { UtilsService } from '../../../services/utils/utils.service';
import { CurrentAnswersService } from '../../../screen/current-answers.service';
import { ScreenService } from '../../../screen/screen.service';
import { CachedAnswersService } from '../../services/applicant-answers/cached-answers.service';
import { DeviceDetectorService } from '../../services/device-detector/device-detector.service';
import { DeviceDetectorServiceStub } from '../../services/device-detector/device-detector.service.stub';

describe('ActionDirective', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActionDirective],
      providers: [
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ActionApiService, useClass: ActionApiServiceStub },
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
    [ActionApiService, UtilsService, ScreenService, NavigationService],
    (
      actionApiService: ActionApiService,
      utilsService: UtilsService,
      screenService: ScreenService,
      navigationService: NavigationService,
    ) => {
      const directive = new ActionDirective(
        actionApiService,
        screenService,
        navigationService,
        utilsService,
      );

      expect(directive).toBeTruthy();
    },
  ));
});
