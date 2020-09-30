import { TestBed } from '@angular/core/testing';

import { ActionDirective } from './action.directive';
import { ConfigService } from '../../../config/config.service';
import { ConfigServiceStub } from '../../../config/config.service.stub';
import { ActionApiService } from '../../../services/api/action-api/action-api.service';
import { ActionApiServiceStub } from '../../../services/api/action-api/action-api.service.stub';
import { NavigationService } from '../../services/navigation/navigation.service';
import { UtilsService } from '../../../services/utils/utils.service';
import { CurrentAnswersService } from '../../../screen/current-answers.service';

describe('ActionDirective', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ActionDirective],
      providers: [
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ActionApiService, useClass: ActionApiServiceStub },
        NavigationService,
        UtilsService,
        CurrentAnswersService,
      ],
    });
  });

  it('should create an instance', () => {
    // const directive = new ActionDirective();
    // expect(directive).toBeTruthy();
  });
});
