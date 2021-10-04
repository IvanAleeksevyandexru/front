import { TestBed } from '@angular/core/testing';
import { DownloadService } from './download.service';
import { configureTestSuite } from 'ng-bullet';
import { DeviceDetectorService } from '../device-detector/device-detector.service';
import { DeviceDetectorServiceStub } from '../device-detector/device-detector.service.stub';

describe('DownloadService', () => {
  let service: DownloadService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        DownloadService,
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(DownloadService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
