import { TestBed } from '@angular/core/testing';
import { DownloadService } from './download.service';

describe('DownloadService', () => {
  let service: DownloadService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DownloadService],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(DownloadService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
