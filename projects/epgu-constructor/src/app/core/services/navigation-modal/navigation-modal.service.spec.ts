import { TestBed } from '@angular/core/testing';

import { NavigationModalService } from './navigation-modal.service';
import { ConfigServiceStub } from '../../config/config.service.stub';
import { ConfigService } from '../../config/config.service';
import { DeviceDetectorService } from '../device-detector/device-detector.service';
import { DeviceDetectorServiceStub } from '../device-detector/device-detector.service.stub';

xdescribe('NavigationModalService', () => {
  let service: NavigationModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NavigationModalService,
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
      ]
    });
    service = TestBed.inject(NavigationModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
