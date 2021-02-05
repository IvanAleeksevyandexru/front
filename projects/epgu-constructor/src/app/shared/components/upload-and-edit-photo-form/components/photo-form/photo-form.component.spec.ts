import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';

import { PhotoFormComponent } from './photo-form.component';
import { UnsubscribeService } from '../../../../../core/services/unsubscribe/unsubscribe.service';
import { DeviceDetectorService } from '../../../../../core/services/device-detector/device-detector.service';
import { ModalService } from '../../../../../modal/modal.service';
import { ModalServiceStub } from '../../../../../modal/modal.service.stub';
import { TerraByteApiService } from '../../../../../component/unique-screen/services/terra-byte-api/terra-byte-api.service';
import { WebcamService } from '../../../../../component/unique-screen/services/webcam/webcam.service';
import { UtilsService } from '../../../../../core/services/utils/utils.service';
import { EventBusService } from '../../../../../core/services/event-bus/event-bus.service';
import { ValidationService } from '../../service/validation/validation.service';
import { UploadService } from '../../service/upload/upload.service';
import { PhotoFormViewComponent } from '../photo-form-view/photo-form-view.component';
import { ConfigService } from '../../../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../../../core/services/config/config.service.stub';
import { CompressionService } from '../../service/compression/compression.service';

describe('PhotoFormComponent', () => {
  let component: PhotoFormComponent;
  let fixture: ComponentFixture<PhotoFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PhotoFormComponent, MockComponent(PhotoFormViewComponent)],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        UnsubscribeService,
        DeviceDetectorService,
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        TerraByteApiService,
        WebcamService,
        UtilsService,
        EventBusService,
        ValidationService,
        UploadService,
        CompressionService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoFormComponent);
    component = fixture.componentInstance;
    component.staticDomainAssetsPath = '';
    component.uploadedFile = {
      uploadId: 'passport_photo',
      mnemonic: 'pd5.PhotoUploadComponent.passport_photo.0',
      objectType: 2,
      name: 'fieldList.jpg',
      fileType: ['JPEG', 'JPG', 'PNG', 'BMP'],
      maxSize: 5242880,
      objectId: '',
    };
    component.fileName = '';
    component.orderId = '';
    component.allowedImgTypes = [];
    component.startToUploadPhoto = { isStart: false };
    component.startToChangeCroppedImageUrl = { isStart: false };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('openCamera', () => {
    it('should be call openCamera click', () => {
      jest.spyOn(component.cameraInput.nativeElement, 'click');
      const selector = 'epgu-constructor-photo-form-view';
      const debugEl = fixture.debugElement.query(By.css(selector));
      debugEl.triggerEventHandler('openCameraEvent', {});
      expect(component.cameraInput.nativeElement.click).toHaveBeenCalled();
    });
  });
});
