import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';

import { ProgramListService } from './program-list.service';

describe('ProgramListService', () => {
  let service: ProgramListService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [ProgramListService],
    });
    service = TestBed.inject(ProgramListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
