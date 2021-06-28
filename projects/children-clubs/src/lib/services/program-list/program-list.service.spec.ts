import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';

import { ProgramListService } from './program-list.service';
import {
  AppStateQuery,
  AppStateQueryStub,
  AppStateService,
  AppStateServiceStub,
} from '@epgu/epgu-constructor-ui-kit';
import { ApiService } from '../api/api.service';
import { ApiServiceStub } from '../api/api.service.stub';
import { StateService } from '../state/state.service';
import { StateServiceStub } from '../state/state.service.stub';

describe('ProgramListService', () => {
  let service: ProgramListService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        ProgramListService,
        { provide: AppStateService, useClass: AppStateServiceStub },
        { provide: StateService, useClass: StateServiceStub },
        { provide: AppStateQuery, useClass: AppStateQueryStub },
        { provide: ApiService, useClass: ApiServiceStub },
      ],
    });
    service = TestBed.inject(ProgramListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
