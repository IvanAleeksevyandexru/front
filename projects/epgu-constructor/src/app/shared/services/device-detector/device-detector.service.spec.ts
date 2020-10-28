import { TestBed } from '@angular/core/testing';

import { DeviceDetectorService } from './device-detector.service';
import { LoadService } from 'epgu-lib';
import { LoadServiceStub } from '../../../config/load-service-stub';

xdescribe('DeviceDetectorService', () => {
  let service: DeviceDetectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DeviceDetectorService,
        { provide: LoadService, useClass: LoadServiceStub }
      ]
    });
    service = TestBed.inject(DeviceDetectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
