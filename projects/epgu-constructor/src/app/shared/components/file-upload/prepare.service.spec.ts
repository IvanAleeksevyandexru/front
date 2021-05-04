import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { PrepareService } from './prepare.service';
import { CompressionService } from '../upload-and-edit-photo-form/service/compression/compression.service';
import { FileUploadService } from './file-upload.service';
import {
  FileUploadItem,
  TerraUploadFileOptions,
  UploadedFile,
} from '../../../core/services/terra-byte-api/terra-byte-api.types';
import { ComponentDto } from 'epgu-constructor-types/dist/base/component-dto';
import { ComponentAttrsDto } from 'epgu-constructor-types/dist/base/component-attrs';
import { FileItem, FileItemStatus } from './file-upload-item/data';

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

describe('PrepareService', () => {
  let service: PrepareService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [PrepareService, CompressionService, FileUploadService],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(PrepareService);
  });

  it('should be run', () => {
    expect(1).toBe(1);
  });
});
