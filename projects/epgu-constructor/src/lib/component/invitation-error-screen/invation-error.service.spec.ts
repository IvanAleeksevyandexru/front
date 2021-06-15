import { TestBed } from '@angular/core/testing';

import { InvitationErrorService } from './invitation-error.service';

xdescribe('InvationErrorService', () => {
  let service: InvitationErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvitationErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
