import { TestBed } from '@angular/core/testing';
import { ModalService } from './modal.service';
import { DeviceDetectorService } from '../core/services/device-detector/device-detector.service';
import { HttpClientModule } from '@angular/common/http';

describe('ModalService', () => {
  let service: ModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeviceDetectorService, ModalService],
      imports: [HttpClientModule]
    });
    service = TestBed.inject(ModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
