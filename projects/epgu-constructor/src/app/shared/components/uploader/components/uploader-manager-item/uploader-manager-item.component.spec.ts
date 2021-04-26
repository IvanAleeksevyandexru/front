import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploaderManagerItemComponent } from './uploader-manager-item.component';
import { BaseModule } from '../../../../base.module';
import { TerraByteApiService } from '../../../../../core/services/terra-byte-api/terra-byte-api.service';
import { TerraByteApiServiceStub } from '../../../../../core/services/terra-byte-api/terra-byte-api.service.stub';
import { ConfigService } from '../../../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../../../core/services/config/config.service.stub';
import { DeviceDetectorService } from '../../../../../core/services/device-detector/device-detector.service';
import { DeviceDetectorServiceStub } from '../../../../../core/services/device-detector/device-detector.service.stub';

describe('UploaderManagerItemComponent', () => {
  let component: UploaderManagerItemComponent;
  let fixture: ComponentFixture<UploaderManagerItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UploaderManagerItemComponent],
      imports: [BaseModule],
      providers: [
        { provide: TerraByteApiService, useClass: TerraByteApiServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploaderManagerItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
