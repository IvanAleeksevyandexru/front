import { TestBed } from '@angular/core/testing';

import { UploaderLimitsService } from './uploader-limits.service';

describe('UploaderLimitsService', () => {
  let service: UploaderLimitsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UploaderLimitsService],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(UploaderLimitsService);
  });

  it('getMaxTotalFilesAmount() should return 0 by default', () => {
    expect(service.getMaxTotalFilesAmount()).toBe(0);
  });

  it('getMaxTotalFilesSize() should return 0 by default', () => {
    expect(service.getMaxTotalFilesSize()).toBe(0);
  });

  describe('setMaxFilesAmount', () => {
    it('should not affect totalMaxFilesAmount, maxFilesAmount, uploadedFilesAmount if value < 0 && !uploader', () => {
      service.registerUploader('', -1, 1);

      expect(service.getMaxTotalFilesAmount()).toBe(0);
      expect(service.getUploader('')).toBeUndefined();
    });

    it('should set totalMaxFilesAmount', () => {
      service.setTotalMaxAmount(33);
      expect(service.getMaxTotalFilesAmount()).toBe(33);
    });

    it('should affect maxFilesAmount, uploadedFilesAmount if uploader !== Uploaders.total', () => {
      service.registerUploader('someUploader', 33, 1);

      expect(service.getMaxTotalFilesAmount()).toBe(0);
      expect(service.getUploader('someUploader').maxAmount).toEqual(33);
      expect(service.getUploader('someUploader').amount).toEqual(0);
    });
  });

  describe('setMaxFilesSize', () => {
    it('should not affect totalMaxFilesSize, maxFilesSize, uploadedFilesSize if value < 0 && !uploader', () => {
      service.registerUploader('', 1, -1);

      expect(service.getMaxTotalFilesSize()).toBe(0);
      expect(service.getUploader('')).toBeUndefined();
    });

    it('should affect totalMaxFilesAmount if uploader === Uploaders.total', () => {
      service.setTotalMaxSize(33);

      expect(service.getMaxTotalFilesSize()).toBe(33);
      expect(service.getUploader('')).toBeUndefined();
    });

    it('should affect maxFilesAmount, uploadedFilesAmount if uploader !== Uploaders.total', () => {
      service.registerUploader('someUploader', 1, 33);

      expect(service.getMaxTotalFilesSize()).toBe(0);
      expect(service.getUploader('someUploader').maxSize).toEqual(33);
      expect(service.getUploader('someUploader').size).toEqual(0);
    });
  });

  describe('updateFilesAmount', () => {
    it('should update uploadedFilesAmount if checkAmount returns 0', () => {
      service.registerUploader('someUploader', 100, 1);

      expect(service.getUploader('someUploader').amount).toEqual(0);

      jest.spyOn(service, 'checkAmount').mockReturnValueOnce(1);
      service.updateFilesAmount(3, 'someUploader');
      expect(service.getUploader('someUploader').amount).toEqual(0);

      jest.spyOn(service, 'checkAmount').mockReturnValue(0);
      service.updateFilesAmount(3, 'someUploader');
      expect(service.getUploader('someUploader').amount).toEqual(3);

      service.updateFilesAmount(4, 'someUploader');
      expect(service.getUploader('someUploader').amount).toEqual(7);
    });
  });

  describe('updateFilesSize', () => {
    it('should update uploadedFilesSize if checkSize returns 0', () => {
      service.registerUploader('someUploader', 1, 100);

      expect(service.getUploader('someUploader').size).toEqual(0);

      jest.spyOn(service, 'checkSize').mockReturnValueOnce(-1);
      service.updateFilesSize(3, 'someUploader');
      expect(service.getUploader('someUploader').size).toEqual(0);

      jest.spyOn(service, 'checkSize').mockReturnValue(0);
      service.updateFilesSize(3, 'someUploader');
      expect(service.getUploader('someUploader').size).toEqual(3);

      service.updateFilesSize(4, 'someUploader');
      expect(service.getUploader('someUploader').size).toEqual(7);
    });
  });

  describe('checkFilesSize', () => {
    it('returns -1 if totalMax and newTotal > totalMax', () => {
      service.setTotalMaxSize(100);

      const result = service.checkSize(200, '');

      // потому что newTotal (200) > totalMax (100)
      expect(result).toEqual(-1);
    });

    it('returns -1 if totalMax and newTotal < 0', () => {
      service.setTotalMaxSize(100);

      const result = service.checkSize(-10, '');

      // потому что newTotal (-10) < 0
      expect(result).toEqual(-1);
    });

    // eslint-disable-next-line max-len
    it('returns 1 if maxUploadersRes[uploader] and newUploaderResValue < 0', () => {
      service.registerUploader('someUploader', 1, 100);

      const result = service.checkSize(-10, 'someUploader');

      // потому что newUploaderResValue (-10) < 0
      expect(result).toEqual(1);
    });

    // eslint-disable-next-line max-len
    it('returns 1 if maxUploadersRes[uploader] and newUploaderResValue > maxUploadersRes[uploader]', () => {
      service.registerUploader('someUploader', 1, 100);

      const result = service.checkSize(200, 'someUploader');

      // потому что newUploaderResValue (200) > maxUploadersRes[uploader] (100)
      expect(result).toEqual(1);
    });

    it('returns 0 if NOT totalMax and NOT maxUploadersRes[uploader]', () => {
      const result = service.checkSize(200, 'someUploader');

      expect(result).toEqual(0);
    });

    it('returns 0 if totalMax and newTotal <= totalMax', () => {
      service.setTotalMaxSize(200);
      let result = service.checkSize(100, '');

      // потому что newTotal (100) <= totalMax (200)
      expect(result).toEqual(0);

      result = service.checkSize(200, '');

      // потому что newTotal (200) <= totalMax (200)
      expect(result).toEqual(0);
    });

    it('returns 0 if totalMax and newTotal >= 0', () => {
      service.setTotalMaxSize(100);

      let result = service.checkSize(0, '');

      // потому что newTotal (0) >= 0
      expect(result).toEqual(0);

      result = service.checkSize(10, '');

      // потому что newTotal (10) >= 0
      expect(result).toEqual(0);
    });

    it('returns 0 if maxUploadersRes[uploader] and newUploaderResValue >= 0', () => {
      service.registerUploader('someUploader', 1, 100);

      let result = service.checkSize(0, 'someUploader');

      // потому что newUploaderResValue (0) >= 0
      expect(result).toEqual(0);

      result = service.checkSize(10, 'someUploader');

      // потому что newUploaderResValue (10) >= 0
      expect(result).toEqual(0);
    });

    it('returns 0 if maxUploadersRes[uploader] and newUploaderResValue <= maxUploadersRes[uploader]', () => {
      service.registerUploader('someUploader', 1, 100);

      let result = service.checkSize(50, 'someUploader');

      // потому что newUploaderResValue (50) <= maxUploadersRes[uploader] (100)
      expect(result).toEqual(0);

      result = service.checkSize(100, 'someUploader');

      // потому что newUploaderResValue (100) <= maxUploadersRes[uploader] (100)
      expect(result).toEqual(0);
    });
  });

  // TODO: Переписать тесты с учётом того, что изменился механизм определения лимитов для услуги
  xdescribe('checkFilesAmount', () => {
    it('returns -1 if totalMax and newTotal > totalMax', () => {
      service.setTotalMaxAmount(100);

      const result = service.checkAmount(200, '');

      // потому что newTotal (200) > totalMax (100)
      expect(result).toEqual(-1);
    });

    it('returns -1 if totalMax and newTotal < 0', () => {
      service.setTotalMaxAmount(200);

      const result = service.checkAmount(-10, '');

      // потому что newTotal (-10) < 0
      expect(result).toEqual(-1);
    });

    // eslint-disable-next-line max-len
    it('returns 1 if maxUploadersRes[uploader] and newUploaderResValue < 0', () => {
      service.registerUploader('someUploader', 100, 1);

      const result = service.checkAmount(-10, 'someUploader');

      // потому что newUploaderResValue (-10) < 0
      expect(result).toEqual(1);
    });

    // eslint-disable-next-line max-len
    it('returns 1 if maxUploadersRes[uploader] and newUploaderResValue > maxUploadersRes[uploader]', () => {
      service.registerUploader('someUploader', 100, 1);

      const result = service.checkAmount(200, 'someUploader');

      // потому что newUploaderResValue (200) > maxUploadersRes[uploader] (100)
      expect(result).toEqual(1);
    });

    it('returns 0 if NOT totalMax and NOT maxUploadersRes[uploader]', () => {
      const result = service.checkAmount(200, 'someUploader');

      expect(result).toEqual(0);
    });

    it('returns 0 if totalMax and newTotal <= totalMax', () => {
      service.setTotalMaxAmount(200);

      let result = service.checkAmount(100, '');

      // потому что newTotal (100) <= totalMax (200)
      expect(result).toEqual(0);

      result = service.checkAmount(200, '');

      // потому что newTotal (200) <= totalMax (200)
      expect(result).toEqual(0);
    });

    it('returns 0 if totalMax and newTotal >= 0', () => {
      service.setTotalMaxAmount(100);

      let result = service.checkAmount(0, '');

      // потому что newTotal (0) >= 0
      expect(result).toEqual(0);

      result = service.checkAmount(10, '');

      // потому что newTotal (10) >= 0
      expect(result).toEqual(0);
    });

    it('returns 0 if maxUploadersRes[uploader] and newUploaderResValue >= 0', () => {
      service.registerUploader('someUploader', 100, 1);

      let result = service.checkAmount(0, 'someUploader');

      // потому что newUploaderResValue (0) >= 0
      expect(result).toEqual(0);

      result = service.checkAmount(10, 'someUploader');

      // потому что newUploaderResValue (10) >= 0
      expect(result).toEqual(0);
    });

    it('returns 0 if maxUploadersRes[uploader] and newUploaderResValue <= maxUploadersRes[uploader]', () => {
      service.registerUploader('someUploader', 100, 1);

      let result = service.checkAmount(50, 'someUploader');

      // потому что newUploaderResValue (50) <= maxUploadersRes[uploader] (100)
      expect(result).toEqual(0);

      result = service.checkAmount(100, 'someUploader');

      // потому что newUploaderResValue (100) <= maxUploadersRes[uploader] (100)
      expect(result).toEqual(0);
    });
  });
});
