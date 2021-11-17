import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { ChangeDetectionStrategy } from '@angular/core';

import { PhotoFormComponent } from './photo-form.component';
import {
  ObjectHelperService,
  UnsubscribeService,
  WINDOW,
  WordTransformService,
} from '@epgu/epgu-constructor-ui-kit';
import { DeviceDetectorService } from '@epgu/epgu-constructor-ui-kit';
import { ModalService, ModalServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { TerraByteApiService } from '../../../../../core/services/terra-byte-api/terra-byte-api.service';
import { WebcamService } from '../../../../../core/services/webcam/webcam.service';
import { DownloadService } from '@epgu/epgu-constructor-ui-kit';
import { EventBusService } from '@epgu/epgu-constructor-ui-kit';
import { ValidationService } from '../../service/validation/validation.service';
import { UploadService } from '../../service/upload/upload.service';
import { PhotoFormViewComponent } from '../photo-form-view/photo-form-view.component';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { ConfigServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { CompressionService } from '../../service/compression/compression.service';

describe('PhotoFormComponent', () => {
  let component: PhotoFormComponent;
  let fixture: ComponentFixture<PhotoFormComponent>;
  let deviceDetector: DeviceDetectorService;
  let webcamService: WebcamService;
  let uploadService: UploadService;
  let modalService: ModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PhotoFormComponent, MockComponent(PhotoFormViewComponent)],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        UnsubscribeService,
        DeviceDetectorService,
        WordTransformService,
        ObjectHelperService,
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: WINDOW, useValue: { navigator: {}}},
        TerraByteApiService,
        WebcamService,
        DownloadService,
        ObjectHelperService,
        EventBusService,
        ValidationService,
        UploadService,
        CompressionService,
      ],
    })
      .overrideComponent(PhotoFormComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoFormComponent);
    deviceDetector = TestBed.inject(DeviceDetectorService);
    webcamService = TestBed.inject(WebcamService);
    uploadService = TestBed.inject(UploadService);
    modalService = TestBed.inject(ModalService);
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
    component.orderId = 0;
    component.allowedImgTypes = ['JPEG', 'JPG', 'PNG', 'BMP'];
    component.startToUploadPhoto = { isStart: false };
    component.startToChangeCroppedImageUrl = { isStart: false };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should be set value to getAcceptType', () => {
      expect(component.acceptType).toBe('.jpeg,.jpg,.png,.bmp');
    });

    it('should be set value to isDesktop', () => {
      expect(component.isDesktop).not.toBeNull();
    });
  });

  describe('getAcceptType()', () => {
    it('should be set value to getAcceptType', () => {
      expect(component.getAcceptType()).toBe('.jpeg,.jpg,.png,.bmp');
    });

    it('should be set image/* to getAcceptType if MI browser', () => {
      jest.spyOn(deviceDetector, 'isMiAndroid').mockReturnValue(true);
      expect(component.getAcceptType()).toBe('image/*');
    });
  });

  describe('changeCroppedPhoto', () => {
    it('should be change photo', () => {
      jest.spyOn(component.img$, 'next');
      const changes: any = {
        startToChangeCroppedImageUrl: {
          currentValue: {
            isStart: true,
          },
        },
      };
      component.ngOnChanges(changes);
      expect(component.img$.next).toHaveBeenCalledWith({
        imageObjectUrl: component.previousImageObjectUrl,
      });
      expect(component.startToChangeCroppedImageUrl).toEqual({ isStart: false });
    });
  });

  describe('uploadPhotoToServer', () => {
    it('should upload photo', () => {
      const expectedData = { fileSize: 2 } as any;
      jest.spyOn(uploadService, 'uploadPhotoToServer').mockReturnValue(of(expectedData));
      jest.spyOn(component.uploadPhotoToServerEvent, 'emit');
      const changes: any = {
        startToUploadPhoto: {
          currentValue: {
            isStart: true,
          },
        },
      };
      component.ngOnChanges(changes);
      expect(component.uploadPhotoToServerEvent.emit).toHaveBeenCalledWith(expectedData);
      expect(component.startToUploadPhoto).toEqual({ isStart: false });
    });
  });

  describe('webcamService', () => {
    it('should be set true to isWebcamAvailable', () => {
      jest.spyOn(webcamService, 'isWebcamAllowed').mockReturnValue(of(true));
      deviceDetector.isDesktop = false;
      fixture.detectChanges();
      component.ngOnInit();
      expect(component.isWebcamAvailable).toBeTruthy();
    });

    it('should be set false to isWebcamAvailable', () => {
      jest.spyOn(webcamService, 'isWebcamAllowed').mockReturnValue(of(false));
      deviceDetector.isDesktop = false;
      fixture.detectChanges();
      component.ngOnInit();
      expect(component.isWebcamAvailable).toBeFalsy();
    });
  });

  describe('onFileSelected', () => {
    it('should be update file name if isPhoto true', () => {
      const file: File = new File([], 'image');
      const fileList: FileList = {
        0: file,
        length: 1,
        item: (index: number) => file,
      };
      const fileInput = { value: 'image' } as HTMLInputElement;
      component.onFileSelected(fileList, fileInput, true);
      expect(/^Foto_[\w-]+.jpg$/.test(component.fileName)).toBeTruthy();
    });

    it('should be update file name if isPhoto false', () => {
      const file: File = new File([], 'image');
      const fileList: FileList = {
        0: file,
        length: 1,
        item: (index: number) => file,
      };
      const fileInput = { value: 'image' } as HTMLInputElement;
      component.onFileSelected(fileList, fileInput, false);
      expect(component.fileName).toBe('image');
    });

    it('should be update file name if isPhoto false and is Mi Android', () => {
      jest.spyOn(deviceDetector, 'isMiAndroid').mockReturnValue(true);
      const file: File = new File([], '..image');
      const fileList: FileList = {
        0: file,
        length: 1,
        item: (index: number) => file,
      };
      const fileInput = { value: 'image' } as HTMLInputElement;
      component.onFileSelected(fileList, fileInput, false);
      expect(component.fileName).toBe('.image');
    });

    it('should be reset fileInput value', () => {
      const fileInput = { value: 'image' } as HTMLInputElement;
      component.onFileSelected({} as any, fileInput, true);
      expect(fileInput.value).toBe('');
    });
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

  describe('subscribeToImgAttachError', () => {
    it('should be click to fileInput', () => {
      jest.spyOn(modalService, 'openModal').mockReturnValue(
        of({
          changeImage: true,
        }),
      );
      jest.spyOn(component.fileInput.nativeElement, 'click');
      component.imgAttachError$.subscribe(() => {
        expect(component.fileInput.nativeElement.click).toHaveBeenCalled();
      });
      component.imgAttachError$.next([['error']]);
    });
  });

  describe('subscribeToImg', () => {
    it('should be click to fileInput', () => {
      jest.spyOn(modalService, 'openModal').mockReturnValue(
        of({
          changeImage: true,
          imageObjectUrl: 'image',
        }),
      );
      jest.spyOn(component.fileInput.nativeElement, 'click');
      jest.spyOn(component.croppedImageUrlEvent, 'emit');
      component.img$.subscribe(() => {
        expect(component.fileInput.nativeElement.click).toHaveBeenCalled();
        expect(component.isModalOpened).toBeFalsy();
      });
      component.img$.next({
        imageErrors: [],
        imageObjectUrl: 'image',
      });
    });

    it('should be change croppedImageUrl', () => {
      jest.spyOn(modalService, 'openModal').mockReturnValue(
        of({
          changeImage: false,
          imageObjectUrl: 'image',
        }),
      );
      jest.spyOn(component.croppedImageUrlEvent, 'emit');
      component.img$.subscribe(() => {
        expect(component.croppedImageUrl).toBe('image');
        expect(component.croppedImageUrlEvent.emit).toHaveBeenCalledWith('image');
        expect(component.isModalOpened).toBeFalsy();
      });
      component.img$.next({
        imageErrors: [],
        imageObjectUrl: 'image',
      });
    });
  });
});
