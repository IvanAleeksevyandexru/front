import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventBusService } from '@epgu/epgu-constructor-ui-kit';
import {
  DeviceDetectorService,
  DeviceDetectorServiceStub,
  ConfigService,
  ConfigServiceStub,
  UnsubscribeService,
  ModalService,
  ModalServiceStub,
} from '@epgu/epgu-constructor-ui-kit';

import { FileUploadItemComponent } from './file-upload-item.component';
import { UserInfoLoaderModule } from '../../user-info-loader/user-info-loader.module';
import { BaseModule } from '../../../base.module';
import { UploaderModule } from '../../uploader/uploader.module';
import { FileSizeModule } from '../../../pipes/file-size/file-size.module';
import { TerraByteApiService } from '../../../../core/services/terra-byte-api/terra-byte-api.service';
import { TerraByteApiServiceStub } from '../../../../core/services/terra-byte-api/terra-byte-api.service.stub';
import { UploaderValidationServiceStub } from '../services/validation/uploader-validation.service.stub';
import { ActionService } from '../../../directives/action/action.service';
import { ActionServiceStub } from '../../../directives/action/action.service.stub';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { AutocompleteService } from '../../../../core/services/autocomplete/autocomplete.service';
import { AutocompleteApiService } from '../../../../core/services/autocomplete/autocomplete-api.service';
import { AutocompleteApiServiceStub } from '../../../../core/services/autocomplete/autocomplete-api.service.stub';
import { DownloadService } from '@epgu/epgu-constructor-ui-kit';
import { DownloadServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { DatesToolsService } from '@epgu/epgu-constructor-ui-kit';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { DatesToolsServiceStub } from '@epgu/epgu-constructor-ui-kit';
import {
  FileUploadItem,
  TerraUploadFileOptions,
  UploadedFile,
} from '../../../../core/services/terra-byte-api/terra-byte-api.types';
import { ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';
import { LoggerService } from '@epgu/epgu-constructor-ui-kit';
import { LoggerServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { FileItem, FileItemStatus } from '../data';
import { of } from 'rxjs';
import { CompressionService } from '../../upload-and-edit-photo-form/service/compression/compression.service';
import { ViewerService } from '../../uploader/services/viewer/viewer.service';
import { ViewerServiceStub } from '../../uploader/services/viewer/viewer.service.stub';
import { ComponentDto, ComponentAttrsDto } from '@epgu/epgu-constructor-types';
import { AutocompletePrepareService } from '../../../../core/services/autocomplete/autocomplete-prepare.service';
import { UploaderValidationService } from '../services/validation/uploader-validation.service';
import { UploaderLimitsService } from '../services/limits/uploader-limits.service';
import { UploaderStoreService } from '../services/store/uploader-store.service';
import { UploaderManagerService } from '../services/manager/uploader-manager.service';
import { UploaderStatService } from '../services/stat/uploader-stat.service';
import { UploaderProcessService } from '../services/process/uploader-process.service';
import { HtmlSelectService } from '../../../../core/services/html-select/html-select.service';
import { JsonHelperService } from '../../../../core/services/json-helper/json-helper.service';
import { PluralizeModule } from '@epgu/ui/pipes';

const objectIdMock = '1231';
const uploadMock: FileUploadItem = {
  title: 'title',
  uploadId: 'passport',
  label: 'label',
  fileType: ['JPEG', 'JPG', 'PNG'],
  maxSize: 5242880,
  maxFileCount: 10,
};

const createFileMock = (name: string, options: Record<string, any> = {}): File => {
  return new File([], name, { type: 'text/plain', lastModified: 0, ...options });
};

const createFileList = (files: File[]): FileList => {
  return (files as unknown) as FileList;
};
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
const mockComponent: ComponentDto = {
  attrs: {} as ComponentAttrsDto,
  label: 'testComponent',
  type: '',
  id: '12',
  value: '',
};

const mockFileItem: () => FileItem = () =>
  new FileItem(FileItemStatus.uploaded, '', null, createUploadedFileMock());

describe('FileUploadItemComponent', () => {
  let component: FileUploadItemComponent;
  let fixture: ComponentFixture<FileUploadItemComponent>;
  let validation: UploaderValidationService;
  let terabyteService: TerraByteApiService;
  let screenService: ScreenService;
  let viewerService: ViewerService;
  let modalService: ModalService;
  let fileUploadService: UploaderLimitsService;
  let uploader: UploaderManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FileUploadItemComponent],
      imports: [BaseModule, UserInfoLoaderModule, UploaderModule, FileSizeModule, PluralizeModule],
      providers: [
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: DatesToolsService, useClass: DatesToolsServiceStub },
        { provide: DownloadService, useClass: DownloadServiceStub },
        { provide: AutocompleteApiService, useClass: AutocompleteApiServiceStub },
        { provide: TerraByteApiService, useClass: TerraByteApiServiceStub },
        { provide: UploaderValidationService, useClass: UploaderValidationServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ActionService, useClass: ActionServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: LoggerService, useClass: LoggerServiceStub },
        { provide: ViewerService, useClass: ViewerServiceStub },
        EventBusService,
        UploaderLimitsService,
        UnsubscribeService,
        AutocompleteService,
        AutocompletePrepareService,
        CurrentAnswersService,
        CompressionService,
        UploaderStoreService,
        UploaderManagerService,
        UploaderStatService,
        UploaderProcessService,
        HtmlSelectService,
        JsonHelperService,
      ],
    })
      .overrideComponent(FileUploadItemComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    validation = TestBed.inject(UploaderValidationService);
    uploader = TestBed.inject(UploaderManagerService);
    terabyteService = TestBed.inject(TerraByteApiService);
    screenService = TestBed.inject(ScreenService);
    viewerService = TestBed.inject(ViewerService);
    modalService = TestBed.inject(ModalService);
    fileUploadService = TestBed.inject(UploaderLimitsService);
    fileUploadService.registerUploader(
      uploadMock.uploadId,
      uploadMock.maxFileCount,
      uploadMock.maxSize,
    );
    fixture = TestBed.createComponent(FileUploadItemComponent);
    component = fixture.componentInstance;
    uploader.data = uploadMock;
    uploader.prefixForMnemonic = 'test';
    uploader.objectId = objectIdMock;

    jest.spyOn(viewerService, 'open').mockImplementation(() => of());
    jest.spyOn(screenService, 'component$', 'get').mockReturnValue(of(mockComponent));
    jest.spyOn(validation, 'prepare').mockImplementation((file: FileItem) => of(file));
    jest.spyOn(terabyteService, 'uploadFile').mockImplementation(() => of(null));
    jest
      .spyOn(terabyteService, 'deleteFile')
      .mockImplementation((options: Partial<TerraUploadFileOptions>) =>
        of(createUploadedFileMock(options) as UploadedFile),
      );
    jest
      .spyOn(terabyteService, 'downloadFile')
      .mockImplementation((options: Partial<TerraUploadFileOptions>) => of(new Blob([])));
    jest
      .spyOn(terabyteService, 'getListByObjectId')
      .mockImplementation(() => of([] as UploadedFile[]));

    jest
      .spyOn(terabyteService, 'getFileInfo')
      .mockImplementation((options: Partial<TerraUploadFileOptions>) =>
        of(createUploadedFileMock(options) as UploadedFile),
      );

    jest.spyOn(screenService, 'orderId', 'get').mockImplementation(() => 123);

    jest.spyOn(terabyteService, 'getDownloadApiPath').mockImplementation(() => 'link');
    window.URL.createObjectURL = () => '';

    fixture.detectChanges();
  });

  it('should be title', () => {
    const debugEl = fixture.debugElement.query(By.css('.title'));
    expect(debugEl?.nativeElement?.innerHTML?.indexOf(uploadMock.title)).not.toBe(-1);
  });

  it('should be label', () => {
    const debugEl = fixture.debugElement.query(By.css('.info__text'));
    expect(debugEl?.nativeElement?.innerHTML?.indexOf(uploadMock.label)).not.toBe(-1);
  });

  it('should load file success', () => {
    const files = createFileList([createFileMock('test.png')]);
    component.selectFiles(files);
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.uploader-manager-item__error-text'))).toBeNull();
  });

  it('should attach file', () => {
    component.suggest({ isAdd: true, file: mockFileItem() });
    fixture.detectChanges();

    expect(
      fixture.debugElement.query(By.css('.uploader-manager-item__button.detach_button')),
    ).not.toBeNull();
  });

  it('should detach file', () => {
    component.suggest({ isAdd: true, file: mockFileItem() });
    fixture.detectChanges();
    const detach: HTMLButtonElement = fixture.debugElement.query(
      By.css('.uploader-manager-item__button.detach_button'),
    )?.nativeElement;
    detach.click();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.uploader-manager-item__container'))).toBeNull();
  });

  it('should delete file', () => {
    const files = createFileList([createFileMock('test.png')]);
    component.selectFiles(files);
    fixture.detectChanges();
    const deleteButton: HTMLButtonElement = fixture.debugElement.query(
      By.css('.uploader-manager-item__button.remove_button'),
    )?.nativeElement;
    deleteButton?.click();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.uploader-manager-item__container'))).toBeNull();
  });

  it('should readonly uploader', () => {
    const files = createFileList([createFileMock('test.png')]);
    component.selectFiles(files);
    uploader.readonly = true;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('epgu-constructor-uploader'))).toBeNull();
    expect(
      fixture.debugElement.query(By.css('.uploader-manager-item__button.remove_button')),
    ).toBeNull();
  });

  it('should open attached viewer', () => {
    component.isGalleryFilesButtonShown = true;
    jest.spyOn(modalService, 'openModal');
    fixture.detectChanges();
    const button: HTMLDivElement = fixture.debugElement.queryAll(
      By.css('.fileupload__link-button'),
    )[0]?.nativeElement;
    button?.click();
    fixture.detectChanges();

    expect(modalService.openModal).toHaveBeenCalled();
  });
});
