import { TestBed } from '@angular/core/testing';

import { UploaderStatService } from './uploader-stat.service';
import { UploaderStoreService } from '../store/uploader-store.service';
import { UploaderStoreServiceStub } from '../store/uploader-store.service.stub';
import { UploaderValidationService } from '../validation/uploader-validation.service';
import { UploaderValidationServiceStub } from '../validation/uploader-validation.service.stub';
import { CheckResult, UploaderLimitsService } from '../limits/uploader-limits.service';
import { UploaderLimitsServiceStub } from '../limits/uploader-limits.service.stub';
import { UploaderManagerService } from '../manager/uploader-manager.service';
import { UploaderManagerServiceStub } from '../manager/uploader-manager.service.stub';
import { ErrorActions, FileItem } from '../../data';
import { FileUploadItem } from '../../../../../core/services/terra-byte-api/terra-byte-api.types';

describe('UploaderStatService', () => {
  let service: UploaderStatService;
  let limits: UploaderLimitsService;
  let uploader: UploaderManagerService;

  const defaultState = {
    totalSize: { count: 0, isMax: false },
    totalAmount: { count: 0, isMax: false },
    amount: { count: 0, isMax: false },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UploaderStatService,
        { provide: UploaderLimitsService, useClass: UploaderLimitsServiceStub },
        { provide: UploaderManagerService, useClass: UploaderManagerServiceStub },
        { provide: UploaderStoreService, useClass: UploaderStoreServiceStub },
        { provide: UploaderValidationService, useClass: UploaderValidationServiceStub },
      ],
    });
    service = TestBed.inject(UploaderStatService);
    limits = TestBed.inject(UploaderLimitsService);
    uploader = TestBed.inject(UploaderManagerService);

    uploader.data = {
      uploadId: 'id',
    } as FileUploadItem;
  });

  it('should reset state', () => {
    const state = { ...defaultState, ...{ totalSize: { count: 1, isMax: false } } };
    service.stats.next(state);
    expect(service.stats.getValue()).toEqual(state);
    service.reset();
    expect(service.stats.getValue()).toEqual(defaultState);
  });

  it('should reset limits', () => {
    const state = { ...defaultState, ...{ totalSize: { count: 2, isMax: false } } };
    service.stats.next(state);
    expect(service.stats.getValue()).toEqual(state);
    service.resetLimits();
    expect(service.stats.getValue()).toEqual(defaultState);
  });

  describe('amountFilter()', () => {
    it('should amount filter - without error', () => {
      const filterResult = service.amountFilter({} as FileItem);

      expect(filterResult).toEqual(true);
      expect(service.stats.getValue()).toEqual(defaultState);
    });

    it('should amount filter - error MaxTotalSize', () => {
      const filterResult = service.amountFilter({
        error: {
          type: ErrorActions.addMaxTotalSize,
        },
      } as FileItem);

      expect(filterResult).toEqual(false);
      expect(service.stats.getValue()).toEqual({
        ...defaultState,
        ...{ totalSize: { count: 1, isMax: false } },
      });
    });

    it('should amount filter - error addMaxTotalAmount', () => {
      const filterResult = service.amountFilter({
        error: {
          type: ErrorActions.addMaxTotalAmount,
        },
      } as FileItem);

      expect(filterResult).toEqual(false);
      expect(service.stats.getValue()).toEqual({
        ...defaultState,
        ...{ totalAmount: { count: 1, isMax: false } },
      });
    });

    it('should amount filter - error addMaxAmount', () => {
      const filterResult = service.amountFilter({
        error: {
          type: ErrorActions.addMaxAmount,
        },
      } as FileItem);

      expect(filterResult).toEqual(false);
      expect(service.stats.getValue()).toEqual({
        ...defaultState,
        ...{ amount: { count: 1, isMax: false } },
      });
    });
  });

  describe('maxLimitUpdate()', () => {
    it('should set totalSize isMax', () => {
      const overLimitedForAll = -1;
      jest.spyOn(limits, 'checkSize').mockReturnValueOnce(overLimitedForAll as CheckResult);

      service.maxLimitUpdate();

      expect(service.stats.getValue()).toEqual({
        ...defaultState,
        ...{ totalSize: { count: 0, isMax: true } },
      });
    });

    it('should set amount isMax', () => {
      const overLimitedForUploader = 1;
      jest.spyOn(limits, 'checkAmount').mockReturnValueOnce(overLimitedForUploader as CheckResult);

      service.maxLimitUpdate();

      expect(service.stats.getValue()).toEqual({
        ...defaultState,
        ...{ amount: { count: 0, isMax: true } },
      });
    });

    it('should set totalAmount isMax', () => {
      const overLimitedForAll = -1;
      jest.spyOn(limits, 'checkAmount').mockReturnValueOnce(overLimitedForAll as CheckResult);

      service.maxLimitUpdate();

      expect(service.stats.getValue()).toEqual({
        ...defaultState,
        ...{ totalAmount: { count: 0, isMax: true } },
      });
    });
  });

  it('incrementLimits()', () => {
    jest.spyOn(limits, 'updateFilesAmount');
    jest.spyOn(limits, 'updateFilesSize');
    jest.spyOn(service, 'maxLimitUpdate');

    service.incrementLimits(({
      setLimited: () => {
        return;
      },
      raw: {
        size: 100,
      },
    } as unknown) as FileItem);

    expect(limits.updateFilesAmount).toHaveBeenCalledWith(1, 'id');
    expect(limits.updateFilesSize).toHaveBeenCalledWith(100, 'id');
    expect(service.maxLimitUpdate).toHaveBeenCalled();
  });

  it('decrementLimits()', () => {
    jest.spyOn(limits, 'updateFilesAmount');
    jest.spyOn(limits, 'updateFilesSize');
    jest.spyOn(service, 'maxLimitUpdate');

    service.decrementLimits(({
      limited: true,
      setLimited: () => {
        return;
      },
      raw: {
        size: 100,
      },
    } as unknown) as FileItem);

    expect(limits.updateFilesAmount).toHaveBeenCalledWith(-1, 'id');
    expect(limits.updateFilesSize).toHaveBeenCalledWith(-100, 'id');
    expect(service.maxLimitUpdate).toHaveBeenCalled();
  });
});
