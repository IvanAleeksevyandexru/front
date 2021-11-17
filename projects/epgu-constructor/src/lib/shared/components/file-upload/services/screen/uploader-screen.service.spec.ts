import { TestBed } from '@angular/core/testing';

import { UploaderScreenService } from './uploader-screen.service';
import {
  FileUploadAttributes,
  UploadedFile,
  FileUploadEmitValue,
} from '../../../../../core/services/terra-byte-api/terra-byte-api.types';

const mockAttrs = {
  maxSize: 1000,
  maxFileCount: 10,
  hideTotalAvailableSize: false,
  hideTotalAvailableCount: false,
} as FileUploadAttributes;

const fileSample: UploadedFile = {
  description: '',
  fileName: 'file-name',
  objectId: 'object-id',
  objectTypeId: 1,
  mnemonic: 'mnemonic-sample',
  uploaded: true,
  fileSize: 100,
  hasError: false,
};

describe('UploaderScreenService', () => {
  let service: UploaderScreenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UploaderScreenService],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(UploaderScreenService);
  });

  it('should set service values from attr', () => {
    expect(service['maxFileSize']).toBeUndefined();
    expect(service['maxFileCount']).toBeUndefined();
    expect(service['hideTotalAvailableSize']).toBeUndefined();
    expect(service['hideTotalAvailableCount']).toBeUndefined();

    service.setValuesFromAttrs(mockAttrs);

    expect(service['maxFileSize']).toBe(1000);
    expect(service['maxFileCount']).toBe(10);
    expect(service['hideTotalAvailableSize']).toBe(false);
    expect(service['hideTotalAvailableCount']).toBe(false);
  });

  it('should update limits', () => {
    service.setValuesFromAttrs(mockAttrs);
    service['currentFilesSize'] = 400;
    service['currentFilesCount'] = 6;

    service.updateLimits();

    expect(service.getFileSizeLeft()).toBe(600);
    expect(service.getFileCountLeft()).toBe(4);
  });

  describe('ShowLimitsInfo', () => {
    it('should be false if hideTotalAvailableSize and hideTotalAvailableCount is TRUE', () => {
      service.setValuesFromAttrs({
        ...mockAttrs,
        ...{
          hideTotalAvailableSize: true,
          hideTotalAvailableCount: true,
        },
      });

      expect(service.showLimitsInfo()).toBeFalsy();
    });

    it('should be false if maxFileCount and maxFileSize is UNDEFINED', () => {
      service.setValuesFromAttrs({
        hideTotalAvailableSize: true,
        hideTotalAvailableCount: true,
      } as FileUploadAttributes);

      expect(service.showLimitsInfo()).toBeFalsy();
    });

    it('should be true if maxFileCount is defined and hideTotalAvailableCount is FALSE', () => {
      service.setValuesFromAttrs({
        ...mockAttrs,
        ...{
          hideTotalAvailableSize: false,
        },
      });

      expect(service.showLimitsInfo()).toBeTruthy();
    });

    it('should be true if maxFileSize is defined and hideTotalAvailableSize is FALSE', () => {
      service.setValuesFromAttrs({
        ...mockAttrs,
        ...{
          hideTotalAvailableCount: false,
        },
      });

      expect(service.showLimitsInfo()).toBeTruthy();
    });
  });

  describe('Current files size and count', () => {
    it('should be set if files attached', () => {
      const emitValue: FileUploadEmitValue = {
        uploadId: 'id1',
        value: [fileSample],
        required: true,
      };

      service.calculateСurrentFiles([emitValue]);

      expect(service.getCurrentFilesSize()).toEqual(100);
      expect(service.getCurrentFilesCount()).toEqual(1);
    });
  });
});
