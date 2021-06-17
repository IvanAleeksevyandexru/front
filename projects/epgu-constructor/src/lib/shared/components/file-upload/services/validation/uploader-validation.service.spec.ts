import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { UploaderValidationService } from './uploader-validation.service';
import { CompressionService } from '../../../upload-and-edit-photo-form/service/compression/compression.service';
import { UploaderLimitsService } from '../limits/uploader-limits.service';
import {
  FileUploadItem,
  TerraUploadFileOptions,
  UploadedFile,
} from '../../../../../core/services/terra-byte-api/terra-byte-api.types';

import { ErrorActions, FileItem, FileItemError, FileItemStatus } from '../../data';
import { UploaderLimitsServiceStub } from '../limits/uploader-limits.service.stub';
import { CompressionServiceStub } from '../../../upload-and-edit-photo-form/service/compression/compression.service.stub';
import { UploaderManagerService } from '../manager/uploader-manager.service';
import { UploaderStoreService } from '../store/uploader-store.service';

const uploadMock: FileUploadItem = {
  title: 'title',
  uploadId: 'passport',
  label: 'label',
  fileType: ['JPEG', 'JPG', 'PNG', 'PDF'],
  maxSize: 5242880,
  maxFileCount: 10,
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

const mockFileItem: () => FileItem = () =>
  new FileItem(FileItemStatus.uploaded, '', null, createUploadedFileMock());

describe('UploaderValidationService', () => {
  let prepareService: UploaderValidationService;
  let uploadService: UploaderLimitsService;
  let compressService: CompressionService;
  let uploaderService: UploaderManagerService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        UploaderValidationService,
        UploaderManagerService,
        UploaderStoreService,
        { provide: UploaderLimitsService, useClass: UploaderLimitsServiceStub },
        { provide: CompressionService, useClass: CompressionServiceStub },
      ],
    });
  });

  beforeEach(() => {
    prepareService = TestBed.inject(UploaderValidationService);
    uploadService = TestBed.inject(UploaderLimitsService);
    compressService = TestBed.inject(CompressionService);
    uploaderService = TestBed.inject(UploaderManagerService);

    uploaderService.data = uploadMock;
  });

  it('should prepare', (done) => {
    const file = mockFileItem();
    jest.spyOn(compressService, 'isValidImageType').mockReturnValueOnce(false);
    jest.spyOn(uploadService, 'checkAmount').mockReturnValueOnce(0);
    jest.spyOn(uploadService, 'checkSize').mockReturnValueOnce(0);
    prepareService.prepare(file).subscribe((fileItem) => {
      expect(fileItem?.error).toBeUndefined();
      done();
    });
  });

  describe('checkAndSetMaxCountByTypes', () => {
    it('should not changed maxAmount', () => {
      jest.spyOn(uploadService, 'changeMaxAmount');
      prepareService.checkAndSetMaxCountByTypes(mockFileItem());
      expect(uploadService.changeMaxAmount).not.toHaveBeenCalled();
    });

    it('should changed maxAmount', () => {
      jest.spyOn(uploadService, 'changeMaxAmount');
      jest.spyOn(uploadService, 'getAmount').mockReturnValueOnce(0);

      const config = { ...uploadMock, maxCountByTypes: [{ type: ['PDF'], maxFileCount: 3 }] };

      jest.spyOn(uploaderService, 'data', 'get').mockReturnValue(config);
      prepareService.checkAndSetMaxCountByTypes(mockFileItem());
      expect(uploadService.changeMaxAmount).toHaveBeenCalledWith(3, uploadMock.uploadId);
    });
  });

  describe('validateType', () => {
    it('should validateType - success', () => {
      const file = mockFileItem();
      jest.spyOn(file, 'isTypeValid').mockReturnValueOnce(true);
      expect(prepareService.validateType(file)?.error).toBeUndefined();
    });

    it('should validateType - error', () => {
      const file = mockFileItem();
      jest.spyOn(file, 'isTypeValid').mockReturnValueOnce(false);
      expect(prepareService.validateType(file)?.error?.type).toBe(ErrorActions.addInvalidType);
    });
  });

  describe('compressImage', () => {
    it('should  compress not image', (done) => {
      jest.spyOn(compressService, 'isValidImageType').mockReturnValueOnce(false);

      const file = mockFileItem();

      prepareService.compressImage(file).subscribe((fileItem) => {
        expect(fileItem).toEqual(file);
        done();
      });
    });

    it('should  compress image ok', (done) => {
      jest.spyOn(compressService, 'isValidImageType').mockReturnValueOnce(true);

      const file = mockFileItem();
      jest
        .spyOn(compressService, 'imageCompression')
        .mockImplementationOnce((): Promise<any> => Promise.resolve(new Blob([])));
      jest.spyOn(file, 'setRaw');
      prepareService.compressImage(file).subscribe(() => {
        expect(file.setRaw).toHaveBeenCalled();
        done();
      });
    });

    it('should  compress image error', (done) => {
      jest.spyOn(compressService, 'isValidImageType').mockReturnValueOnce(true);

      const file = mockFileItem();
      jest
        .spyOn(compressService, 'imageCompression')
        .mockImplementationOnce((): Promise<any> => Promise.reject(null));

      prepareService.compressImage(file).subscribe((fileItem) => {
        expect(fileItem?.error?.type).toBe(ErrorActions.addInvalidFile);
        done();
      });
    });
  });

  describe('validateAmount', () => {
    it('should  validateAmount - success', () => {
      jest.spyOn(uploadService, 'checkAmount').mockReturnValueOnce(0);

      expect(prepareService.validateAmount(mockFileItem()).error).toBeUndefined();
    });

    it('should  validateAmount - error maxAmount', () => {
      jest.spyOn(uploadService, 'checkAmount').mockReturnValueOnce(1);

      expect(prepareService.validateAmount(mockFileItem())?.error?.type).toBe(
        ErrorActions.addMaxAmount,
      );
    });
    it('should  validateAmount - error maxTotalAmount', () => {
      jest.spyOn(uploadService, 'checkAmount').mockReturnValueOnce(-1);

      expect(prepareService.validateAmount(mockFileItem())?.error?.type).toBe(
        ErrorActions.addMaxTotalAmount,
      );
    });
  });

  describe('validateSize', () => {
    it('should  validateSize - success', () => {
      jest.spyOn(uploadService, 'checkSize').mockReturnValueOnce(0);

      expect(prepareService.validateSize(mockFileItem()).error).toBeUndefined();
    });

    it('should  validateMinSize - error', () => {
      const fileItem = mockFileItem();

      uploaderService.data = { ...uploadMock, minSize: 124 };
      expect(prepareService.validateMinSize(fileItem).error?.type).toBe(ErrorActions.addMinSize);
    });

    it('should  validateSize - error maxSize', () => {
      jest.spyOn(uploadService, 'checkSize').mockReturnValueOnce(1);

      expect(prepareService.validateSize(mockFileItem())?.error?.type).toBe(
        ErrorActions.addMaxSize,
      );
    });

    it('should  validateSize - error maxTotalSize', () => {
      jest.spyOn(uploadService, 'checkSize').mockReturnValueOnce(-1);

      expect(prepareService.validateSize(mockFileItem())?.error?.type).toBe(
        ErrorActions.addMaxTotalSize,
      );
    });
  });
});
