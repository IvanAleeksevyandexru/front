import { TestBed } from '@angular/core/testing';

import { IframePlayerService } from './iframe-player.service';
import { LoggerService } from '@epgu/epgu-constructor-ui-kit';

describe('IframePlayerService', () => {
  let service: IframePlayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IframePlayerService, LoggerService],
    });
    service = TestBed.inject(IframePlayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
