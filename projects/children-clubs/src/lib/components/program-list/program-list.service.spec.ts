import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';

import { ProgramListService } from './program-list.service';
import {
  AppStateQuery,
  AppStateQueryStub,
  AppStateService,
  AppStateServiceStub,
} from '@epgu/epgu-constructor-ui-kit';
import { ApiService } from '../../services/api/api.service';
import { ApiServiceStub } from '../../services/api/api.service.stub';

describe('ProgramListService', () => {
  let service: ProgramListService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        ProgramListService,
        { provide: AppStateService, useClass: AppStateServiceStub },
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
