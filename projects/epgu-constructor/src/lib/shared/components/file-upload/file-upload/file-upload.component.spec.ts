import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { configureTestSuite } from 'ng-bullet';
import { EventBusService, UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { FileUploadAttributes } from '../../../../core/services/terra-byte-api/terra-byte-api.types';
import { FileUploadItemComponent } from '../file-upload-item/file-upload-item.component';
import { FileUploadComponent } from './file-upload.component';
import { Clarifications } from '@epgu/epgu-constructor-types';
import { UploaderLimitsService } from '../services/limits/uploader-limits.service';
import { MemoModule } from '@epgu/epgu-constructor-ui-kit';
import { FileUploadContainerComponent } from '../file-upload-container/file-upload-container.component';
import { UploaderStoreService } from '../services/store/uploader-store.service';
import { TerraByteApiService } from '../../../../core/services/terra-byte-api/terra-byte-api.service';
import { TerraByteApiServiceStub } from '../../../../core/services/terra-byte-api/terra-byte-api.service.stub';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { AutocompletePrepareService } from '../../../../core/services/autocomplete/autocomplete-prepare.service';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { DatesToolsService } from '@epgu/epgu-constructor-ui-kit';
import { DatesToolsServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { JsonHelperService } from '../../../../core/services/json-helper/json-helper.service';

describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;
  let FileUploadItemComponentMock = MockComponent(FileUploadItemComponent);
  let eventService: EventBusService;
  let mockAttributes: FileUploadAttributes = {
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

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent(FileUploadContainerComponent),
        FileUploadComponent,
        FileUploadItemComponentMock,
      ],
      imports: [MemoModule],
      providers: [
        UnsubscribeService,
        UploaderLimitsService,
        EventBusService,
        UploaderStoreService,
        { provide: TerraByteApiService, useClass: TerraByteApiServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: DatesToolsService, useClass: DatesToolsServiceStub },
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
      files: [{ required: true, uploadId: '1', value: [] }],
    };
    jest.spyOn(eventService, 'emit');
    component['handleNewValueForItem'](event);

    expect(eventService.emit).toHaveBeenCalledWith('fileUploadValueChangedEvent', check);
    expect(component['value']?.files).toEqual(check.files);
  });
});
