import { TestBed } from '@angular/core/testing';

import { UploaderStoreService } from './uploader-store.service';
import {
  MaxCountByType,
  TerraUploadFileOptions,
  UploadedFile,
} from '../../../../../core/services/terra-byte-api/terra-byte-api.types';
import { ErrorActions, FileItem, FileItemError, FileItemStatus } from '../../data';

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

const mockFileItem: (status?: FileItemStatus, fileName?: string) => FileItem = (
  status?: FileItemStatus,
  fileName?: string,
) =>
  new FileItem(
    (status ? status : FileItemStatus.uploaded) as FileItemStatus,
    '',
    null,
    createUploadedFileMock((fileName ? { fileName } : {}) as Partial<TerraUploadFileOptions>),
  );
const createError = (type: ErrorActions, text?: string, description?: string) => {
  return { type, description: description ?? '', text: text ?? '' } as FileItemError;
};

describe('UploaderStoreService', () => {
  let service: UploaderStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UploaderStoreService],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(UploaderStoreService);
  });

  it('should add', () => {
    service.add(mockFileItem());
    expect(service.files.getValue().length).toBe(1);
  });

  it('should reset', () => {
    service.add(mockFileItem());
    service.lastSelected = ({} as unknown) as MaxCountByType;
    service.reset();
    expect(service.lastSelected).toBeNull();
    expect(service.files.getValue().length).toBe(0);
  });

  it('should getUniqueTypes', () => {
    service.add(mockFileItem(FileItemStatus.uploaded, 'test.pdf'));
    service.add(mockFileItem(FileItemStatus.uploaded, 'test2.pdf'));
    service.add(mockFileItem(FileItemStatus.uploaded, 'test3.png'));
    service.add(mockFileItem(FileItemStatus.uploaded, 'test4.png'));
    service.add(mockFileItem(FileItemStatus.uploaded, 'test5.jpg'));
    expect(service.getUniqueTypes().length).toBe(3);
  });

  it('should getUniqueTypes with without item', () => {
    const item = mockFileItem(FileItemStatus.uploaded, 'test5.jpg');
    service.add(mockFileItem(FileItemStatus.uploaded, 'test.pdf'));
    service.add(mockFileItem(FileItemStatus.uploaded, 'test2.pdf'));
    service.add(mockFileItem(FileItemStatus.uploaded, 'test3.png'));
    service.add(mockFileItem(FileItemStatus.uploaded, 'test4.png'));
    service.add(item);
    expect(service.getUniqueTypes(item).length).toBe(2);
  });

  it('should getFiles', () => {
    service.add(mockFileItem());
    expect(service.getFiles().length).toBe(1);
  });

  it('should update', () => {
    const item = mockFileItem();
    service.add(mockFileItem());
    service.add(item);
    service.add(mockFileItem());
    item.setAttached(true);
    item.setStatus(FileItemStatus.uploading);
    service.update(item);

    expect(service.getFiles()[1]).toEqual(item);
  });

  it('should remove', () => {
    const item = mockFileItem();
    service.add(item);
    expect(service.getFiles().length).toBe(1);
    service.remove(item);
    expect(service.getFiles().length).toBe(0);
  });

  it('should removeWithErrorStatus', () => {
    const item = mockFileItem();
    item.setError(createError(ErrorActions.addUploadErr));
    service.add(item);
    expect(service.getFiles().length).toBe(1);
    service.removeWithErrorStatus([ErrorActions.addUploadErr]);
    expect(service.getFiles().length).toBe(1);
    service.removeWithErrorStatus();
    expect(service.getFiles().length).toBe(0);
  });

  it('should changeStatus', () => {
    const item = mockFileItem();
    service.add(item);
    service.changeStatus(item, FileItemStatus.preparation);
    expect(service.getFiles()[0].status).toBe(FileItemStatus.preparation);
  });

  it('should errorTo', () => {
    const item = mockFileItem();
    item.setError(createError(ErrorActions.addUploadErr));
    service.add(item);
    service.errorTo(ErrorActions.addUploadErr, FileItemStatus.delition);
    expect(service.getFiles()[0].status).toBe(FileItemStatus.delition);
  });
});
