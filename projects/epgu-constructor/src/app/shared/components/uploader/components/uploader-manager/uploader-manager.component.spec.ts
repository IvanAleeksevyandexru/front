import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploaderManagerComponent } from './uploader-manager.component';
import { ViewerService } from '../../services/viewer/viewer.service';
import { ViewerServiceStub } from '../../services/viewer/viewer.service.stub';
import { UploaderManagerItemComponent } from '../uploader-manager-item/uploader-manager-item.component';
import { BaseModule } from '../../../../base.module';
import { TerraByteApiService } from '../../../../../core/services/terra-byte-api/terra-byte-api.service';
import { TerraByteApiServiceStub } from '../../../../../core/services/terra-byte-api/terra-byte-api.service.stub';
import { ConfigService } from '../../../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../../../core/services/config/config.service.stub';
import { DeviceDetectorService } from '../../../../../core/services/device-detector/device-detector.service';
import { DeviceDetectorServiceStub } from '../../../../../core/services/device-detector/device-detector.service.stub';

import { ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';
import {
  TerraUploadFileOptions,
  UploadedFile,
} from '../../../../../core/services/terra-byte-api/terra-byte-api.types';
import { FileItem, FileItemStatus } from '../../../file-upload/file-upload-item/data';
import { of } from 'rxjs';
import { configureTestSuite } from 'ng-bullet';
import { MockModule } from 'ng-mocks';

const createUploadedFileMock = (options: Partial<TerraUploadFileOptions> = {}): UploadedFile => {
  return {
    fileName: '123.pdf',
    objectId: '123',
    mnemonic: 'fu1.FileUploadComponent.passport.1',
    mimeType: 'pdf',
    fileSize: 123,
    fileUid: 1882985687,
    metaId: 1874756798,
    objectTypeId: 2,
    fileExt: 'pdf',
    hasSign: false,
    created: '2021-03-18',
    updated: '2021-03-18',
    realPath: '62/0/0/18/82/98/56/Lw9wNROzOOo3',
    deleted: false,
    bucket: 'epgu202103',
    nodeId: 'f_dc',
    userId: 1000466316,
    uploaded: true,
    hasError: false,
    alternativeMimeTypes: [],
    ...options,
  };
};

const mockFileItem: () => FileItem = () =>
  new FileItem(FileItemStatus.uploaded, '', null, createUploadedFileMock());

const mockItem = mockFileItem();

describe('UploaderManagerComponent', () => {
  let component: UploaderManagerComponent;
  let fixture: ComponentFixture<UploaderManagerComponent>;
  let viewerService: ViewerService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [UploaderManagerComponent, UploaderManagerItemComponent],
      providers: [
        { provide: ViewerService, useClass: ViewerServiceStub },
        { provide: TerraByteApiService, useClass: TerraByteApiServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
      ],
      imports: [MockModule(BaseModule)],
    })
      .overrideComponent(UploaderManagerComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploaderManagerComponent);
    viewerService = TestBed.inject(ViewerService);
    component = fixture.componentInstance;
    component.list = [mockItem];

    jest.spyOn(viewerService, 'open').mockImplementation(() => of());

    fixture.detectChanges();
  });

  it('should be items list', () => {
    const item = fixture.debugElement.query(By.css('epgu-constructor-uploader-manager-item'))
      ?.nativeElement;
    expect(item).not.toBeNull();
  });

  it('should open modal', () => {
    jest.spyOn(viewerService, 'open');
    component.view(mockItem);
    fixture.detectChanges();

    expect(viewerService.open).toHaveBeenCalled();
  });
});
