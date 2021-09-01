import { TestBed } from '@angular/core/testing';

import { DownloadService } from './download.service';
import { configureTestSuite } from 'ng-bullet';

describe('UtilsService', () => {
  let service: DownloadService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        DownloadService,
      ]
    });
  });

  beforeEach(() => {
    service = TestBed.inject(DownloadService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
