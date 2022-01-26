import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UploaderProcessService } from './uploader-process.service';
import { TerraByteApiService } from '../../../../../core/services/terra-byte-api/terra-byte-api.service';
import { TerraByteApiServiceStub } from '../../../../../core/services/terra-byte-api/terra-byte-api.service.stub';
import { UploaderStoreService } from '../store/uploader-store.service';
import { UploaderStoreServiceStub } from '../store/uploader-store.service.stub';
import { UploaderManagerService } from '../manager/uploader-manager.service';
import { UploaderManagerServiceStub } from '../manager/uploader-manager.service.stub';
import { UploaderStatService } from '../stat/uploader-stat.service';
import { UploaderStatServiceStub } from '../stat/uploader-stat.service.stub';
import { UploaderValidationService } from '../validation/uploader-validation.service';
import { UploaderValidationServiceStub } from '../validation/uploader-validation.service.stub';
import { FileItem, FileItemStatus, Operation, OperationHandler, OperationType } from '../../data';
import {
  TerraUploadFileOptions,
  UploadedFile,
} from '../../../../../core/services/terra-byte-api/terra-byte-api.types';
import { BehaviorSubject, of, timer } from 'rxjs';
import { ForTestsOnlyModule } from '../../../../../core/for-tests-only.module';

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

describe('UploaderProcessService', () => {
  let uploaderProcessService: UploaderProcessService;
  let uploaderStoreService: UploaderStoreService;
  let uploaderManagerService: UploaderManagerService;
  let uploaderStatService: UploaderStatService;
  let uploaderValidationService: UploaderValidationService;
  let terraByteApiService: TerraByteApiService;

  let testFileItem = mockFileItem();
  let testNumber = 5;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ForTestsOnlyModule],
    });
  });

  beforeEach(() => {
    terraByteApiService = TestBed.inject(TerraByteApiService);
    uploaderProcessService = TestBed.inject(UploaderProcessService);
    uploaderStoreService = TestBed.inject(UploaderStoreService);
    uploaderManagerService = TestBed.inject(UploaderManagerService);
    uploaderStatService = TestBed.inject(UploaderStatService);
    uploaderValidationService = TestBed.inject(UploaderValidationService);
  });

  describe('base', () => {
    it('should be increment', () => {
      uploaderProcessService.increment();
      expect(uploaderProcessService.counter.getValue()).toBe(1);
    });

    it('should be decrement', () => {
      uploaderProcessService.counter.next(2);
      uploaderProcessService.decrement();
      expect(uploaderProcessService.counter.getValue()).toBe(1);
    });

    it('should be createOperation', (done) => {
      const op = (() => of(testNumber) as unknown) as OperationHandler;

      uploaderProcessService.stream$.subscribe((value) => {
        expect(value).toBe(testNumber);
        done();
      });
      uploaderProcessService.createOperation(OperationType.delete, testFileItem, op);
    });

    it('should be getOperationId', () => {
      expect(uploaderProcessService.getOperationId(OperationType.delete, testFileItem)).toBe(
        `${OperationType.delete}${testFileItem.id}`,
      );
    });

    it('should be cancel', () => {
      jest.useFakeTimers();
      uploaderProcessService.stream$.subscribe();
      const handler = ((() => timer(5000)) as unknown) as OperationHandler;
      const operation = {
        type: OperationType.upload,
        item: mockFileItem(),
        handler,
        cancel: new BehaviorSubject<boolean>(false),
      } as Operation;
      uploaderProcessService.stream.next(operation);

      expect(uploaderProcessService.operations).toEqual({
        [uploaderProcessService.getOperationId(operation.type, operation.item)]: operation,
      });
      uploaderProcessService.cancel(operation.type, operation.item);
      jest.runAllTimers();
      expect(uploaderProcessService.operations).toEqual({});
    });

    it('should be stream', (done) => {
      jest.spyOn(uploaderProcessService, 'getOperationId');
      jest.spyOn(uploaderProcessService, 'createOperation');
      const op = jest.fn((() => of(testNumber) as unknown) as OperationHandler);

      uploaderProcessService.stream$.subscribe(() => {
        expect(op).toHaveBeenCalled();
        expect(uploaderProcessService.getOperationId).toHaveBeenCalled();
        expect(uploaderProcessService.createOperation).toHaveBeenCalled();

        done();
      });
      uploaderProcessService.createOperation(OperationType.delete, testFileItem, op);
    });
  });

  describe('prepare', () => {
    it('should be prepareOperation', (done) => {
      const fileItem = mockFileItem();
      jest.spyOn(uploaderStoreService, 'changeStatus');
      jest.spyOn(uploaderValidationService, 'prepare').mockReturnValueOnce(of(fileItem));
      jest.spyOn(uploaderStoreService, 'update');
      jest.spyOn(uploaderProcessService, 'upload').mockReturnValueOnce(null);
      uploaderProcessService
        .prepareOperation(
          createOperationMock(OperationType.prepare, fileItem, jest.fn()),
          FileItemStatus.preparation,
        )
        .subscribe(() => {
          expect(uploaderStoreService.changeStatus).toHaveBeenCalledWith(
            fileItem,
            FileItemStatus.preparation,
          );
          expect(uploaderValidationService.prepare).toHaveBeenCalledWith(fileItem);
          expect(uploaderStoreService.update).toHaveBeenCalledWith(fileItem);
          expect(uploaderProcessService.upload).toHaveBeenCalledWith(fileItem);
          done();
        });
    });
    it('should be prepare', (done) => {
      jest.spyOn(uploaderProcessService, 'prepareOperation');
      uploaderProcessService.stream$.subscribe(() => {
        expect(uploaderProcessService.prepareOperation).toHaveBeenCalled();
        done();
      });
      uploaderProcessService.prepare(testFileItem);
    });
  });

  describe('download', () => {
    it('should be downloadOperation', (done) => {
      const fileItem = mockFileItem();
      const blob = new Blob([]);
      jest.spyOn(uploaderStoreService, 'changeStatus');
      jest.spyOn(terraByteApiService, 'pushFileToBrowserForDownload');
      jest.spyOn(terraByteApiService, 'downloadFile').mockReturnValueOnce(of(blob));

      uploaderProcessService
        .downloadOperation(
          createOperationMock(OperationType.download, fileItem, jest.fn()),
          FileItemStatus.downloading,
        )
        .subscribe(() => {
          expect(uploaderStoreService.changeStatus).toHaveBeenCalledWith(
            fileItem,
            FileItemStatus.downloading,
          );

          expect(terraByteApiService.pushFileToBrowserForDownload).toHaveBeenCalled();
          expect(terraByteApiService.downloadFile).toHaveBeenCalled();

          done();
        });
    });
    it('should be download', (done) => {
      jest.spyOn(uploaderProcessService, 'downloadOperation');
      uploaderProcessService.stream$.subscribe(() => {
        expect(uploaderProcessService.downloadOperation).toHaveBeenCalled();
        done();
      });
      uploaderProcessService.download(testFileItem);
    });
  });

  describe('delete', () => {
    it('should be deleteOperation', (done) => {
      const fileItem = mockFileItem(FileItemStatus.uploaded);
      jest.spyOn(uploaderStoreService, 'changeStatus');
      jest.spyOn(uploaderStoreService, 'remove');
      jest
        .spyOn(terraByteApiService, 'deleteFile')
        .mockReturnValueOnce(of(({} as unknown) as UploadedFile));

      uploaderProcessService
        .deleteOperation(
          createOperationMock(OperationType.delete, fileItem, jest.fn()),
          FileItemStatus.delition,
        )
        .subscribe(() => {
          expect(terraByteApiService.deleteFile).toHaveBeenCalled();
          expect(uploaderStoreService.changeStatus).toHaveBeenCalledWith(
            fileItem,
            FileItemStatus.delition,
          );
          expect(uploaderStoreService.remove).toHaveBeenCalledWith(fileItem);

          done();
        });
    });
    it('should be delete', (done) => {
      jest.spyOn(uploaderProcessService, 'deleteOperation');
      uploaderProcessService.stream$.subscribe(() => {
        expect(uploaderProcessService.deleteOperation).toHaveBeenCalled();
        done();
      });
      uploaderProcessService.delete(testFileItem);
    });
  });

  describe('upload', () => {
    it('should be uploadOperation', (done) => {
      const fileItem = mockFileItem(FileItemStatus.uploaded);
      jest.spyOn(uploaderStoreService, 'changeStatus');
      jest.spyOn(uploaderStoreService, 'update');
      jest.spyOn(uploaderStatService, 'incrementLimits');
      jest.spyOn(terraByteApiService, 'uploadFile').mockReturnValue(of(null));
      jest
        .spyOn(terraByteApiService, 'getFileInfo')
        .mockReturnValue(of(({} as unknown) as UploadedFile));

      uploaderProcessService
        .uploadOperation(
          createOperationMock(OperationType.upload, fileItem, jest.fn()),
          FileItemStatus.uploading,
        )
        .subscribe(() => {
          expect(uploaderStoreService.update).toHaveBeenCalled();
          expect(uploaderStatService.incrementLimits).toHaveBeenCalled();
          expect(terraByteApiService.uploadFile).toHaveBeenCalled();
          expect(terraByteApiService.getFileInfo).toHaveBeenCalled();
          expect(uploaderStoreService.changeStatus).toHaveBeenCalledWith(
            fileItem,
            FileItemStatus.uploading,
          );

          done();
        });
    });
    it('should be upload', (done) => {
      jest.spyOn(uploaderProcessService, 'uploadOperation');
      uploaderProcessService.stream$.subscribe(() => {
        expect(uploaderProcessService.uploadOperation).toHaveBeenCalled();
        done();
      });
      uploaderProcessService.upload(testFileItem);
    });
  });

  describe('copy', () => {
    it('should be copyOperation', (done) => {
      const fileItem = mockFileItem(FileItemStatus.uploaded);
      const newFileItem = mockFileItem(FileItemStatus.uploaded);
      jest.spyOn(uploaderStoreService, 'changeStatus');
      jest.spyOn(uploaderStatService, 'incrementLimits');
      jest.spyOn(terraByteApiService, 'copyFile').mockReturnValue(of(null));

      uploaderProcessService
        .copyOperation(
          newFileItem,
          createOperationMock(OperationType.upload, fileItem, jest.fn()),
          FileItemStatus.uploading,
        )
        .subscribe(() => {
          expect(uploaderStatService.incrementLimits).toHaveBeenCalled();
          expect(terraByteApiService.copyFile).toHaveBeenCalled();
          expect(uploaderStoreService.changeStatus).toHaveBeenCalledWith(
            newFileItem,
            FileItemStatus.uploading,
          );

          done();
        });
    });
    it('should be copy', (done) => {
      jest.spyOn(uploaderProcessService, 'copyOperation');
      uploaderProcessService.stream$.subscribe(() => {
        expect(uploaderProcessService.copyOperation).toHaveBeenCalled();
        done();
      });
      uploaderProcessService.copy(testFileItem, testFileItem);
    });
  });
});
