import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseModule } from '../../../../base.module';
import { ZoomModule } from '../../../zoom/zoom.module';
import { UploaderViewerContentComponent } from './uploader-viewer-content.component';
import { ConfigService } from '../../../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../../../core/services/config/config.service.stub';
import { DeviceDetectorService } from '../../../../../core/services/device-detector/device-detector.service';
import { DeviceDetectorServiceStub } from '../../../../../core/services/device-detector/device-detector.service.stub';
import { TerraByteApiService } from '../../../../../core/services/terra-byte-api/terra-byte-api.service';
import { TerraByteApiServiceStub } from '../../../../../core/services/terra-byte-api/terra-byte-api.service.stub';

describe('UploaderViewerContentComponent', () => {
  let component: UploaderViewerContentComponent;
  let fixture: ComponentFixture<UploaderViewerContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UploaderViewerContentComponent],
      imports: [BaseModule, ZoomModule],
      providers: [
        { provide: TerraByteApiService, useClass: TerraByteApiServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploaderViewerContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
