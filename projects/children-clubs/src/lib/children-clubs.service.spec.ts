import { TestBed } from '@angular/core/testing';

import { ChildrenClubsService } from './children-clubs.service';

describe('ChildrenClubsService', () => {
  let service: ChildrenClubsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChildrenClubsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
