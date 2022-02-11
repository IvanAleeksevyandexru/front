import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockModule } from 'ng-mocks';
import {
  EventBusService,
  UnsubscribeService,
  JsonHelperService,
  MemoModule,
  DatesToolsService,
  DatesToolsServiceStub,
} from '@epgu/epgu-constructor-ui-kit';
import { Clarifications } from '@epgu/epgu-constructor-types';
import {
  FileUploadAttributes,
  FileUploadItem,
  UploadedFile,
} from '../../../../core/services/terra-byte-api/terra-byte-api.types';
import { FileUploadItemComponent } from '../file-upload-item/file-upload-item.component';
import { FileUploadComponent } from './file-upload.component';
import { UploaderLimitsService } from '../services/limits/uploader-limits.service';
import { FileUploadContainerComponent } from '../file-upload-container/file-upload-container.component';
import { UploaderStoreService } from '../services/store/uploader-store.service';
import { TerraByteApiService } from '../../../../core/services/terra-byte-api/terra-byte-api.service';
import { TerraByteApiServiceStub } from '../../../../core/services/terra-byte-api/terra-byte-api.service.stub';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { AutocompletePrepareService } from '../../../../core/services/autocomplete/autocomplete-prepare.service';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { BaseModule } from '../../../base.module';
import { UploadContext } from '../data';
import { of } from 'rxjs';

describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;
  const FileUploadItemComponentMock = MockComponent(FileUploadItemComponent);
  let eventService: EventBusService;
  let api: TerraByteApiService;

  const mockAttributes: FileUploadAttributes = {
    clarifications: ([] as unknown) as Clarifications,
    uploads: [
      {
        uploadId: '1',
        label: '',
        fileType: ['txt'],
        maxFileCount: 1,
        maxSize: 42,
      },
    ],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent(FileUploadContainerComponent),
        FileUploadComponent,
        FileUploadItemComponentMock,
      ],
      imports: [MemoModule, MockModule(BaseModule)],
      providers: [
        UnsubscribeService,
        UploaderLimitsService,
        EventBusService,
        UploaderStoreService,
        { provide: TerraByteApiService, useClass: TerraByteApiServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: DatesToolsService, useClass: DatesToolsServiceStub },
        { provide: TerraByteApiService, useClass: TerraByteApiServiceStub },
        AutocompletePrepareService,
        CurrentAnswersService,
        JsonHelperService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.componentInstance;
    component.attributes = mockAttributes;
    eventService = TestBed.inject(EventBusService);
    api = TestBed.inject(TerraByteApiService);
    fixture.detectChanges();
  });

  it('should be init', () => {
    jest.spyOn(eventService, 'emit');
    component.attributes = mockAttributes;
    fixture.detectChanges();

    expect(eventService.emit).toHaveBeenCalledWith('fileUploadValueChangedEvent', {
      errors: [],
      files: [{ uploadId: '1', value: [] }],
    });
  });

  it('should be markSuggestFile', () => {
    expect(component['markSuggestFile'](({} as unknown) as UploadedFile)).toEqual({
      isFromSuggests: true,
    });
  });

  it('should be fillUploadsDefaultValue', () => {
    component.attributes.uploads = [
      ({
        uploadId: '1',
        maxSize: 3,
        maxCountByTypes: 2,
        maxFileCount: 5,
        pdfFileName: 'df.pdf',
      } as unknown) as FileUploadItem,
    ];

    expect(component['fillUploadsDefaultValue']()).toEqual([
      { pdfFileName: 'df.pdf', uploadId: '1', value: [] },
    ]);
  });

  it('should be setUploadersRestrictions', () => {
    component.attributes.maxSize = 5;
    component.attributes.maxFileCount = 6;
    const fn = jest.fn();
    component['setTotalMaxSizeAndAmount'] = fn;
    //uploadId, maxSize, maxCountByTypes, maxFileCount
    component.attributes.uploads = [
      ({
        uploadId: '1',
        maxSize: 3,
        maxCountByTypes: 2,
        maxFileCount: 5,
      } as unknown) as FileUploadItem,
      ({
        uploadId: '2',
        maxSize: 6,
        maxCountByTypes: null,
        maxFileCount: 9,
      } as unknown) as FileUploadItem,
    ];

    jest.spyOn(component.limits, 'registerUploader');

    component['setUploadersRestrictions']();

    expect(fn).toHaveBeenCalledWith(5, 6);
    expect(component.limits.registerUploader).toHaveBeenCalledWith('1', 5, 3);
    expect(component.limits.registerUploader).toHaveBeenCalledWith('2', 9, 6);
  });

  it('should be getMnemonicWithoutOrder', () => {
    expect(component['getMnemonicWithoutOrder']('test.test.123')).toBe('test.test');
  });

  it('should be getUploadContext', () => {
    component.prefixForMnemonic = 'mnemo';

    component.objectId = 'o1';
    component.attributes = ({ clarifications: { cl: 1 } } as unknown) as FileUploadAttributes;
    const upload = ({ uploadId: 'id' } as unknown) as FileUploadItem;
    const id = `${component.prefixForMnemonic}.${upload.uploadId}`;
    const files = { [id]: [{} as UploadedFile] };
    const galleryFiles = { [id]: [{} as UploadedFile] };
    expect(component.getUploadContext([upload, files, galleryFiles])).toEqual({
      data: upload,
      prefixForMnemonic: component.prefixForMnemonic,
      objectId: component.objectId,
      clarifications: component.attributes?.clarifications,
      files: files[id] || [],
      galleryFiles: galleryFiles || [],
    } as UploadContext);
  });

  it('should be setTotalMaxSizeAndAmount', () => {
    jest.spyOn(component.limits, 'setTotalMaxSize');
    jest.spyOn(component.limits, 'setTotalMaxAmount');

    component['setTotalMaxSizeAndAmount'](1, 1);
    expect(component.limits.setTotalMaxSize).toHaveBeenCalledWith(1);
    expect(component.limits.setTotalMaxAmount).toHaveBeenCalledWith(1);
  });

  it('should be set total', () => {
    const spy = jest.spyOn(component.limits, 'registerUploader');
    component.ngOnInit();

    expect(spy).toHaveBeenCalledWith(
      mockAttributes.uploads[0].uploadId,
      mockAttributes.uploads[0].maxFileCount,
      mockAttributes.uploads[0].maxSize,
    );
  });

  it('should be set total for maxCountByTypes', () => {
    const spy = jest.spyOn(component.limits, 'registerUploader');
    const attrs = { ...mockAttributes, uploads: [...mockAttributes.uploads] };
    attrs.uploads[0].maxCountByTypes = [{ type: ['pdf'], maxFileCount: 2 }];
    component.attributes = attrs;
    component.ngOnInit();

    expect(spy).toHaveBeenCalledWith(
      mockAttributes.uploads[0].uploadId,
      0,
      mockAttributes.uploads[0].maxSize,
    );
  });

  it('should be set total for maxFileCount', () => {
    const spy = jest.spyOn(component.limits, 'registerUploader');
    const attrs = { ...mockAttributes, uploads: [...mockAttributes.uploads] };
    attrs.uploads[0].maxFileCount = null;
    component.ngOnInit();

    expect(spy).toHaveBeenCalledWith(
      mockAttributes.uploads[0].uploadId,
      0,
      mockAttributes.uploads[0].maxSize,
    );
  });

  it('should handleNewValueForItem', () => {
    const event = {
      uploadId: '1',
      required: true,
      value: [],
      errors: [],
      pdfFileName: 'name.pdf',
      files: [],
    };
    const check = {
      errors: [],
      files: [
        { required: true, uploadId: '1', value: [] },
        { uploadId: '2', value: [] },
      ],
    };
    jest.spyOn(eventService, 'emit');
    component['handleNewValueForItem'](event);

    expect(eventService.emit).toHaveBeenCalledWith('fileUploadValueChangedEvent', check);
    expect(component['value']?.files).toEqual(check.files);
  });

  it('should be getFilesList', (done) => {
    component['_objectId'].next('1');

    jest
      .spyOn(api, 'getListByObjectId')
      .mockReturnValue(
        of([
          { mnemonic: 'test.test.34' } as UploadedFile,
          { mnemonic: 'test2.2test.34' } as UploadedFile,
        ]),
      );
    component.getFilesList$.subscribe((value) => {
      expect(api.getListByObjectId).toHaveBeenCalledWith('1');
      expect(value).toEqual({
        'test.test': [{ mnemonic: 'test.test.34' }],
        'test2.2test': [{ mnemonic: 'test2.2test.34' }],
      });
      done();
    });
  });
});
