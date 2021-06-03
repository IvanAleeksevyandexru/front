import { TestBed } from '@angular/core/testing';

import { ProgramListService } from './program-list.service';

describe('ProgramListService', () => {
  let service: ProgramListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgramListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
