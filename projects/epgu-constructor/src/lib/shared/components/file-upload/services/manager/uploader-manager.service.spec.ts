import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UploaderStoreService } from '../store/uploader-store.service';
import { UploaderManagerService } from './uploader-manager.service';

import {
  createError,
  ErrorActions,
  FileItem,
  FileItemStatus,
  Operation,
  OperationHandler,
  OperationType,
} from '../../data';
import {
  FileUploadItem,
  TerraUploadFileOptions,
  UploadedFile,
} from '../../../../../core/services/terra-byte-api/terra-byte-api.types';
import { BehaviorSubject } from 'rxjs';
import { UploaderCounter, UploaderLimitsService } from '../limits/uploader-limits.service';

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

const createOperationMock = (type: OperationType, item: FileItem, handler: OperationHandler) => {
  return {
    type,
    item,
    handler,
    cancel: new BehaviorSubject<boolean>(false),
  } as Operation;
};

const mockFileItem: (status?: FileItemStatus, fileName?: string) => FileItem = (
  status?: FileItemStatus,
  fileName?: string,
) =>
  new FileItem(
    (status || FileItemStatus.uploaded) as FileItemStatus,
    '',
    null,
    createUploadedFileMock((fileName ? { fileName } : {}) as Partial<TerraUploadFileOptions>),
  );

describe('UploaderManagerService', () => {
  let uploaderStoreService: UploaderStoreService;
  let service: UploaderManagerService;
  let uploaderLimitsService: UploaderLimitsService;

  const data = ({
    uploadId: '3',
    readonly: false,
    maxCountByTypes: [
      {
        type: ['PDF'],
        maxFileCount: 1,
      },
      {
        type: ['JPEG', 'PNG', 'JPG'],
        maxFileCount: 3,
      },
    ],
  } as unknown) as FileUploadItem;

  let testFileItem = mockFileItem();
  let testNumber = 5;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UploaderLimitsService, UploaderManagerService, UploaderStoreService],
    });
  });

  beforeEach(() => {
    uploaderStoreService = TestBed.inject(UploaderStoreService);
    uploaderLimitsService = TestBed.inject(UploaderLimitsService);
    service = TestBed.inject(UploaderManagerService);
  });

  describe('base', () => {
    it('should set data', () => {
      jest.spyOn(service.data$$, 'next');
      service.data = ({} as unknown) as FileUploadItem;
      expect(service.data$$.next).toHaveBeenCalledWith({});
    });

    it('should be data$', () => {
      service.data = ({} as unknown) as FileUploadItem;
      jest.spyOn(service, 'init');
      service.data$.subscribe();
      expect(service.init).toHaveBeenCalledWith({});
    });

    it('should set readonly', () => {
      jest.spyOn(service.readonly$$, 'next');
      service.readonly = false;
      expect(service.readonly$$.next).toHaveBeenCalledWith(false);
    });

    it('should set maxTotalSize', () => {
      jest.spyOn(service.maxTotalSize$$, 'next');
      service.maxTotalSize = 1;
      expect(service.maxTotalSize$$.next).toHaveBeenCalledWith(1);
    });

    it('should set maxTotalAmount', () => {
      jest.spyOn(service.maxTotalAmount$$, 'next');
      service.maxTotalAmount = 1;
      expect(service.maxTotalAmount$$.next).toHaveBeenCalledWith(1);
    });

    it('should set maxAmount', () => {
      jest.spyOn(service.maxAmount$$, 'next');
      service.maxAmount = 1;
      expect(service.maxAmount$$.next).toHaveBeenCalledWith(1);
    });

    it('should set maxSize', () => {
      jest.spyOn(service.maxSize$$, 'next');
      service.maxSize = 1;
      expect(service.maxSize$$.next).toHaveBeenCalledWith(1);
    });

    it('should set prefixForMnemonic', () => {
      jest.spyOn(service.prefixForMnemonic$$, 'next');
      service.prefixForMnemonic = 'prefix';
      expect(service.prefixForMnemonic$$.next).toHaveBeenCalledWith('prefix');
    });

    it('should set objectId', () => {
      jest.spyOn(service.objectId$$, 'next');
      service.objectId = '1';
      expect(service.objectId$$.next).toHaveBeenCalledWith('1');
    });

    it('should be getSubMnemonicPath', () => {
      service.prefixForMnemonic = 's';
      service.data = ({ uploadId: '2' } as unknown) as FileUploadItem;
      expect(service.getSubMnemonicPath()).toBe('s.2');
    });

    it('should be getMnemonic', () => {
      service.prefixForMnemonic = 's';
      service.data = ({ uploadId: '2' } as unknown) as FileUploadItem;
      expect(service.getMnemonic(2)).toBe('s.2.2');
      expect(service.maxFileNumber).toBe(0);
    });

    it('should be init', () => {
      jest.spyOn(uploaderLimitsService, 'getMaxTotalFilesAmount').mockReturnValue(2);
      jest.spyOn(uploaderLimitsService, 'getMaxTotalFilesSize').mockReturnValue(3);
      jest.spyOn(service, 'updateLimits');
      jest.spyOn(uploaderLimitsService, 'getAmount').mockReturnValue(1);
      jest.spyOn(uploaderLimitsService, 'changeMaxAmount');
      jest
        .spyOn(uploaderLimitsService, 'getUploader')
        .mockReturnValue(({ maxSize: 6, maxAmount: 8 } as unknown) as UploaderCounter);
      service.data = data;
      service.init(data);

      expect(service.maxTotalSize).toBe(3);
      expect(service.maxTotalAmount).toBe(2);
      expect(service.updateLimits).toHaveBeenCalledWith(1);
      expect(uploaderLimitsService.changeMaxAmount).toHaveBeenCalledWith(4, '3');
      expect(service.readonly).toBeFalsy();
      expect(service.maxAmount).toBe(4);
      expect(service.maxSize).toBe(4);
    });
    it('should be acceptTypes', () => {
      service.data = data;
      expect(service.acceptTypes).toBe('.pdf,.jpeg,.png,.jpg');
    });
    it('should be hasImageTypes', () => {
      service.data = data;
      expect(service.hasImageTypes).toBeTruthy();
    });
    it('should be updateMaxFileNumber', () => {
      service.updateMaxFileNumber(({ mnemonic: 'sdf.12' } as unknown) as UploadedFile);
      expect(service.maxFileNumber).toBe(12);
    });
  });
});
