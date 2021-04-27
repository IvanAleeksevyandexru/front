import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseModule } from '../../../../base.module';
import { UploaderViewerComponent } from './uploader-viewer.component';
import { ZoomModule } from '../../../zoom/zoom.module';
import { UploaderViewerContentComponent } from '../uploader-viewer-content/uploader-viewer-content.component';
import { TerraByteApiService } from '../../../../../core/services/terra-byte-api/terra-byte-api.service';
import { TerraByteApiServiceStub } from '../../../../../core/services/terra-byte-api/terra-byte-api.service.stub';
import { ConfigService } from '../../../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../../../core/services/config/config.service.stub';
import { DeviceDetectorService } from '../../../../../core/services/device-detector/device-detector.service';
import { DeviceDetectorServiceStub } from '../../../../../core/services/device-detector/device-detector.service.stub';
import { ChangeDetectionStrategy } from '@angular/core';
import {
  TerraUploadFileOptions,
  UploadedFile,
} from '../../../../../core/services/terra-byte-api/terra-byte-api.types';
import { FileItem, FileItemStatus } from '../../../file-upload/file-upload-item/data';
import { FilesCollection, ViewerInfo } from '../../data';
import { By } from '@angular/platform-browser';
import { MockComponent, MockModule } from 'ng-mocks';
import { configureTestSuite } from 'ng-bullet';

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
const mockInfo: ViewerInfo = { position: 1, size: 1, file: mockItem };

describe('UploaderViewerComponent', () => {
  let component: UploaderViewerComponent;
  let fixture: ComponentFixture<UploaderViewerComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [UploaderViewerComponent, MockComponent(UploaderViewerContentComponent)],
      providers: [
        { provide: TerraByteApiService, useClass: TerraByteApiServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
      ],
      imports: [MockModule(BaseModule), MockModule(ZoomModule)],
    })
      .overrideComponent(UploaderViewerComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploaderViewerComponent);
    component = fixture.componentInstance;
    component.item = mockInfo;
    // eslint-disable-next-line no-empty-function
    component.detachView = () => {};
    fixture.detectChanges();
  });

  it('should be title not suggest type', () => {
    expect(
      fixture.debugElement.query(By.css('.modal__title'))?.nativeElement?.innerHTML?.trim(),
    ).toBe('Просмотр фото');
  });

  it('should be title suggest type', () => {
    component.type = FilesCollection.suggest;
    fixture.detectChanges();
    expect(
      fixture.debugElement.query(By.css('.modal__title'))?.nativeElement?.innerHTML?.trim(),
    ).toBe('Ранее загруженные файлы');
  });

  it('should close event', () => {
    spyOn(component, 'closeModal');
    fixture.debugElement.query(By.css('.modal__close'))?.nativeElement?.click();
    fixture.detectChanges();
    expect(component.closeModal).toHaveBeenCalled();
  });

  it('should be content', () => {
    const content = fixture.debugElement.query(By.css('epgu-constructor-uploader-viewer-content'))
      ?.nativeElement;
    expect(content).not.toBeNull();
  });
});
