import { TestBed } from '@angular/core/testing';

import { IframePlayerService } from './iframe-player.service';

describe('IframePlayerService', () => {
  let service: IframePlayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IframePlayerService],
    });
    service = TestBed.inject(IframePlayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
