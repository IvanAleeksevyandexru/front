import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { EventBusService } from '../../../../core/services/event-bus/event-bus.service';
import {
  FileUploadAttributes,
  UploadedFile,
} from '../../../../core/services/terra-byte-api/terra-byte-api.types';
import { FileUploadItemComponent } from '../file-upload-item/file-upload-item.component';
import { FileUploadService } from '../file-upload.service';
import { FileUploadComponent } from './file-upload.component';
import { configureTestSuite } from 'ng-bullet';
import { Clarifications } from '@epgu/epgu-constructor-types';

describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;
  let FileUploadItemComponentMock = MockComponent(FileUploadItemComponent);
  let uploadService: FileUploadService;
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
      declarations: [FileUploadComponent, FileUploadItemComponentMock],
      providers: [FileUploadService, EventBusService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploadComponent);
    uploadService = TestBed.inject(FileUploadService);
    eventService = TestBed.inject(EventBusService);
    component = fixture.componentInstance;
    component.attributes = mockAttributes;
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

  it('should be getFiles', () => {
    fixture.detectChanges();
    expect(component.getFiles()).toEqual([{ uploadId: '1', value: [] }]);
  });

  it('should be set total', () => {
    jest.spyOn(uploadService, 'registerUploader');
    fixture.detectChanges();
    expect(uploadService.registerUploader).toHaveBeenCalledWith(
      mockAttributes.uploads[0].uploadId,
      mockAttributes.uploads[0].maxFileCount,
      mockAttributes.uploads[0].maxSize,
    );
  });
  it('should be set total for maxCountByTypes', () => {
    jest.spyOn(uploadService, 'registerUploader');
    const attrs = { ...mockAttributes, uploads: [...mockAttributes.uploads] };
    attrs.uploads[0].maxCountByTypes = [{ type: ['pdf'], maxFileCount: 2 }];
    component.attributes = attrs;
    fixture.detectChanges();
    expect(uploadService.registerUploader).toHaveBeenCalledWith(
      mockAttributes.uploads[0].uploadId,
      0,
      mockAttributes.uploads[0].maxSize,
    );
  });
  it('should be set total for maxFileCount', () => {
    jest.spyOn(uploadService, 'registerUploader');
    const attrs = { ...mockAttributes, uploads: [...mockAttributes.uploads] };
    attrs.uploads[0].maxFileCount = null;
    fixture.detectChanges();
    expect(uploadService.registerUploader).toHaveBeenCalledWith(
      mockAttributes.uploads[0].uploadId,
      0,
      mockAttributes.uploads[0].maxSize,
    );
  });
  it('should be mnemonic', () => {
    component.prefixForMnemonic = 'test';
    fixture.detectChanges();
    expect(component.getUploadComponentPrefixForMnemonic('ref')).toBe('test.ref');
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
    component.handleNewValueForItem(event);
    expect(eventService.emit).toHaveBeenCalledWith('fileUploadValueChangedEvent', check);
    expect(component.getFiles()).toEqual(check.files);
  });
});
