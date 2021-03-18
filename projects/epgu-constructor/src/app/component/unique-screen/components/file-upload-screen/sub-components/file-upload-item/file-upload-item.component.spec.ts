import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EventBusService } from '../../../../../../core/services/event-bus/event-bus.service';
import { FileUploadItemComponent } from './file-upload-item.component';
import { UserInfoLoaderModule } from '../../../../../../shared/components/user-info-loader/user-info-loader.module';
import { BaseModule } from '../../../../../../shared/base.module';
import { UploaderModule } from '../../../../../../shared/components/uploader/uploader.module';
import { FileSizeModule } from '../../../../../../shared/pipes/file-size/file-size.module';
import { TerraByteApiService } from '../../../../../../core/services/terra-byte-api/terra-byte-api.service';
import { TerraByteApiServiceStub } from '../../../../../../core/services/terra-byte-api/terra-byte-api.service.stub';
import { PrepareService } from '../prepare.service';
import { PrepareServiceStub } from '../prepare.service.stub';
import { DeviceDetectorService } from '../../../../../../core/services/device-detector/device-detector.service';
import { DeviceDetectorServiceStub } from '../../../../../../core/services/device-detector/device-detector.service.stub';
import { FileUploadService } from '../file-upload.service';

import { ConfigService } from '../../../../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../../../../core/services/config/config.service.stub';
import { ActionService } from '../../../../../../shared/directives/action/action.service';
import { ActionServiceStub } from '../../../../../../shared/directives/action/action.service.stub';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';
import { UnsubscribeService } from '../../../../../../core/services/unsubscribe/unsubscribe.service';
import { AutocompleteService } from '../../../../../../core/services/autocomplete/autocomplete.service';
import { ModalService } from '../../../../../../modal/modal.service';
import { AutocompleteApiService } from '../../../../../../core/services/autocomplete/autocomplete-api.service';
import { AutocompleteApiServiceStub } from '../../../../../../core/services/autocomplete/autocomplete-api.service.stub';
import { UtilsService } from '../../../../../../core/services/utils/utils.service';
import { UtilsServiceStub } from '../../../../../../core/services/utils/utils.service.stub';
import { DatesToolsService } from '../../../../../../core/services/dates-tools/dates-tools.service';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { DatesToolsServiceStub } from '../../../../../../core/services/dates-tools/dates-tools.service.stub';
import {
  FileUploadItem,
  FileUploadItemTypes,
  UploadedFile,
} from '../../../../../../core/services/terra-byte-api/terra-byte-api.types';
import { ChangeDetectionStrategy } from '@angular/core';

const objectIdMock = '1231';
const uploadMock: FileUploadItem = {
  uploadId: 'passport',
  type: FileUploadItemTypes.single,
  label: 'label',
  fileType: ['JPEG', 'JPG', 'PNG'],
  maxSize: 5242880,
  maxFileCount: 10,
};

const createFileMock = (name: string, options: Record<string, any>): File => {
  return new File([], name, { type: 'text/plain', lastModified: 0 });
};

const createFileList = (files: File[]): FileList => {
  return (files as unknown) as FileList;
};
const createUploadedFileMock = (
  fileName: string,
  objectId: string,
  mnemonic: string,
  mimeType: string,
  fileSize: number,
): UploadedFile => {
  return {
    fileName,
    objectId,
    mnemonic, //fu1.FileUploadComponent.passport.1
    mimeType,
    fileSize,
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
  };
};

// TODO: дописать тесты
describe('FileUploadItemComponent', () => {
  let component: FileUploadItemComponent;
  let fixture: ComponentFixture<FileUploadItemComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [FileUploadItemComponent],
        imports: [BaseModule, UserInfoLoaderModule, UploaderModule, FileSizeModule],
        providers: [
          EventBusService,
          FileUploadService,
          UnsubscribeService,
          AutocompleteService,
          ModalService,
          CurrentAnswersService,
          { provide: DatesToolsService, useClass: DatesToolsServiceStub },
          { provide: UtilsService, useClass: UtilsServiceStub },
          { provide: AutocompleteApiService, useClass: AutocompleteApiServiceStub },
          { provide: TerraByteApiService, useClass: TerraByteApiServiceStub },
          { provide: PrepareService, useClass: PrepareServiceStub },
          { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
          { provide: ConfigService, useClass: ConfigServiceStub },
          { provide: ActionService, useClass: ActionServiceStub },
          { provide: ScreenService, useClass: ScreenServiceStub },
        ],
      })
        .overrideComponent(FileUploadItemComponent, {
          set: { changeDetection: ChangeDetectionStrategy.Default },
        })
        .compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploadItemComponent);
    component = fixture.componentInstance;
    component.data = uploadMock;
    component.objectId = objectIdMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
