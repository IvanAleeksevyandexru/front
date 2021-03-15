import { TestBed } from '@angular/core/testing';

import { CheckFailedReasons, FileUploadService, Uploaders } from './file-upload.service';

describe('FileUploadService', () => {
  let service: FileUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FileUploadService],
    });
    service = TestBed.inject(FileUploadService);
  });

  it('getMaxTotalFilesAmount() should return 0 by default', () => {
    expect(service.getMaxTotalFilesAmount()).toBe(0);
  });

  it('getMaxTotalFilesSize() should return 0 by default', () => {
    expect(service.getMaxTotalFilesSize()).toBe(0);
  });

  describe('setMaxFilesAmount', () => {
    it('should not affect totalMaxFilesAmount, maxFilesAmount, uploadedFilesAmount if value < 0 && !uploader', () => {
      service.setMaxFilesAmount(-1, '');

      expect(service.getMaxTotalFilesAmount()).toBe(0);
      expect(service.getMaxFilesAmount()).toEqual({});
      expect(service.getUploadedFilesAmount()).toEqual({});
    });

    it('should affect totalMaxFilesAmount if uploader === Uploaders.total', () => {
      service.setMaxFilesAmount(33, Uploaders.total);

      expect(service.getMaxTotalFilesAmount()).toBe(33);
      expect(service.getMaxFilesAmount()).toEqual({});
      expect(service.getUploadedFilesAmount()).toEqual({});
    });

    it('should affect maxFilesAmount, uploadedFilesAmount if uploader !== Uploaders.total', () => {
      service.setMaxFilesAmount(33, 'someUploader');

      expect(service.getMaxTotalFilesAmount()).toBe(0);
      expect(service.getMaxFilesAmount()).toEqual({
        someUploader: 33
      });
      expect(service.getUploadedFilesAmount()).toEqual({
        someUploader: 0
      });
    });
  });

  describe('setMaxFilesSize', () => {
    it('should not affect totalMaxFilesSize, maxFilesSize, uploadedFilesSize if value < 0 && !uploader', () => {
      service.setMaxFilesSize(-1, '');

      expect(service.getMaxTotalFilesSize()).toBe(0);
      expect(service.getMaxFilesSize()).toEqual({});
      expect(service.getUploadedFilesSize()).toEqual({});
    });

    it('should affect totalMaxFilesAmount if uploader === Uploaders.total', () => {
      service.setMaxFilesSize(33, Uploaders.total);

      expect(service.getMaxTotalFilesSize()).toBe(33);
      expect(service.getMaxFilesSize()).toEqual({});
      expect(service.getUploadedFilesSize()).toEqual({});
    });

    it('should affect maxFilesAmount, uploadedFilesAmount if uploader !== Uploaders.total', () => {
      service.setMaxFilesSize(33, 'someUploader');

      expect(service.getMaxTotalFilesSize()).toBe(0);
      expect(service.getMaxFilesSize()).toEqual({
        someUploader: 33
      });
      expect(service.getUploadedFilesSize()).toEqual({
        someUploader: 0
      });
    });
  });

  describe('updateFilesAmount', () => {
    it('should update uploadedFilesAmount if checkFilesAmount returns {isValid: true}', () => {
      service.setMaxFilesAmount(100, 'someUploader');

      expect(service.getUploadedFilesAmount()).toEqual({
        someUploader: 0
      });

      jest.spyOn(service, 'checkFilesAmount').mockReturnValueOnce({ isValid: false });
      service.updateFilesAmount(3, 'someUploader');
      expect(service.getUploadedFilesAmount()).toEqual({
        someUploader: 0
      });

      jest.spyOn(service, 'checkFilesAmount').mockReturnValue({ isValid: true });
      service.updateFilesAmount(3, 'someUploader');
      expect(service.getUploadedFilesAmount()).toEqual({
        someUploader: 3
      });

      service.updateFilesAmount(4, 'someUploader');
      expect(service.getUploadedFilesAmount()).toEqual({
        someUploader: 7
      });
    });
  });

  describe('updateFilesSize', () => {
    it('should update uploadedFilesSize if checkFilesSize returns {isValid: true}', () => {
      service.setMaxFilesSize(100, 'someUploader');

      expect(service.getUploadedFilesSize()).toEqual({
        someUploader: 0
      });

      jest.spyOn(service, 'checkFilesSize').mockReturnValueOnce({ isValid: false });
      service.updateFilesSize(3, 'someUploader');
      expect(service.getUploadedFilesSize()).toEqual({
        someUploader: 0
      });

      jest.spyOn(service, 'checkFilesSize').mockReturnValue({ isValid: true });
      service.updateFilesSize(3, 'someUploader');
      expect(service.getUploadedFilesSize()).toEqual({
        someUploader: 3
      });

      service.updateFilesSize(4, 'someUploader');
      expect(service.getUploadedFilesSize()).toEqual({
        someUploader: 7
      });
    });
  });

  describe('decrementFilesSize', () => {
    it('should update uploadedFilesSize if checkFilesSize returns {isValid: true}', () => {
      service.setMaxFilesSize(100, 'someUploader');

      jest.spyOn(service, 'checkFilesSize').mockReturnValueOnce({ isValid: true });
      service.updateFilesSize(10, 'someUploader');

      expect(service.getUploadedFilesSize()).toEqual({
        someUploader: 10
      });

      jest.spyOn(service, 'checkFilesSize').mockReturnValueOnce({ isValid: false });
      service.decrementFilesSize(3, 'someUploader');
      // не меняем значение, потому что isValid false
      expect(service.getUploadedFilesSize()).toEqual({
        someUploader: 10
      });

      jest.spyOn(service, 'checkFilesSize').mockReturnValue({ isValid: true });
      service.decrementFilesSize(3, 'someUploader');
      expect(service.getUploadedFilesSize()).toEqual({
        someUploader: 7
      });

      service.decrementFilesSize(4, 'someUploader');
      expect(service.getUploadedFilesSize()).toEqual({
        someUploader: 3
      });
    });
  });

  describe('checkFilesSize', () => {

    it('returns { isValid: false, reason: CheckFailedReasons.total } if totalMax and newTotal > totalMax', () => {
      service.setMaxFilesSize(100, Uploaders.total);

      const result = service.checkFilesSize(200, '');

      // потому что newTotal (200) > totalMax (100)
      expect(result).toEqual({
        isValid: false,
        reason: CheckFailedReasons.total
      });
    });

    it('returns { isValid: false, reason: CheckFailedReasons.total } if totalMax and newTotal < 0', () => {
      service.setMaxFilesSize(100, Uploaders.total);

      const result = service.checkFilesSize(-10, '');

      // потому что newTotal (-10) < 0
      expect(result).toEqual({
        isValid: false,
        reason: CheckFailedReasons.total
      });
    });

    // eslint-disable-next-line max-len
    it('returns { isValid: false, reason: CheckFailedReasons.uploaderRestriction } if maxUploadersRes[uploader] and newUploaderResValue < 0', () => {
      service.setMaxFilesSize(100, 'someUploader');

      const result = service.checkFilesSize(-10, 'someUploader');

      // потому что newUploaderResValue (-10) < 0
      expect(result).toEqual({
        isValid: false,
        reason: CheckFailedReasons.uploaderRestriction
      });
    });

    // eslint-disable-next-line max-len
    it('returns { isValid: false, reason: CheckFailedReasons.uploaderRestriction } if maxUploadersRes[uploader] and newUploaderResValue > maxUploadersRes[uploader]', () => {
      service.setMaxFilesSize(100, 'someUploader');

      const result = service.checkFilesSize(200, 'someUploader');

      // потому что newUploaderResValue (200) > maxUploadersRes[uploader] (100)
      expect(result).toEqual({
        isValid: false,
        reason: CheckFailedReasons.uploaderRestriction
      });
    });

    it('returns { isValid: true } if NOT totalMax and NOT maxUploadersRes[uploader]', () => {
      const result = service.checkFilesSize(200, 'someUploader');

      expect(result).toEqual({
        isValid: true,
      });
    });

    it('returns { isValid: true } if totalMax and newTotal <= totalMax', () => {
      service.setMaxFilesSize(200, Uploaders.total);

      let result = service.checkFilesSize(100, '');

      // потому что newTotal (100) <= totalMax (200)
      expect(result).toEqual({
        isValid: true,
      });

      result = service.checkFilesSize(200, '');

      // потому что newTotal (200) <= totalMax (200)
      expect(result).toEqual({
        isValid: true,
      });
    });

    it('returns { isValid: true } if totalMax and newTotal >= 0', () => {
      service.setMaxFilesSize(100, Uploaders.total);

      let result = service.checkFilesSize(0, '');

      // потому что newTotal (0) >= 0
      expect(result).toEqual({
        isValid: true,
      });

      result = service.checkFilesSize(10, '');

      // потому что newTotal (10) >= 0
      expect(result).toEqual({
        isValid: true,
      });
    });

    it('returns { isValid: true } if maxUploadersRes[uploader] and newUploaderResValue >= 0', () => {
      service.setMaxFilesSize(100, 'someUploader');

      let result = service.checkFilesSize(0, 'someUploader');

      // потому что newUploaderResValue (0) >= 0
      expect(result).toEqual({
        isValid: true
      });

      result = service.checkFilesSize(10, 'someUploader');

      // потому что newUploaderResValue (10) >= 0
      expect(result).toEqual({
        isValid: true
      });
    });

    it('returns { isValid: true } if maxUploadersRes[uploader] and newUploaderResValue <= maxUploadersRes[uploader]', () => {
      service.setMaxFilesSize(100, 'someUploader');

      let result = service.checkFilesSize(50, 'someUploader');

      // потому что newUploaderResValue (50) <= maxUploadersRes[uploader] (100)
      expect(result).toEqual({
        isValid: true
      });

      result = service.checkFilesSize(100, 'someUploader');

      // потому что newUploaderResValue (100) <= maxUploadersRes[uploader] (100)
      expect(result).toEqual({
        isValid: true
      });
    });
  });

  describe('checkFilesAmount', () => {
    it('returns { isValid: false, reason: CheckFailedReasons.total } if totalMax and newTotal > totalMax', () => {
      service.setMaxFilesAmount(100, Uploaders.total);

      const result = service.checkFilesAmount(200, '');

      // потому что newTotal (200) > totalMax (100)
      expect(result).toEqual({
        isValid: false,
        reason: CheckFailedReasons.total
      });
    });

    it('returns { isValid: false, reason: CheckFailedReasons.total } if totalMax and newTotal < 0', () => {
      service.setMaxFilesAmount(100, Uploaders.total);

      const result = service.checkFilesAmount(-10, '');

      // потому что newTotal (-10) < 0
      expect(result).toEqual({
        isValid: false,
        reason: CheckFailedReasons.total
      });
    });

    // eslint-disable-next-line max-len
    it('returns { isValid: false, reason: CheckFailedReasons.uploaderRestriction } if maxUploadersRes[uploader] and newUploaderResValue < 0', () => {
      service.setMaxFilesAmount(100, 'someUploader');

      const result = service.checkFilesAmount(-10, 'someUploader');

      // потому что newUploaderResValue (-10) < 0
      expect(result).toEqual({
        isValid: false,
        reason: CheckFailedReasons.uploaderRestriction
      });
    });

    // eslint-disable-next-line max-len
    it('returns { isValid: false, reason: CheckFailedReasons.uploaderRestriction } if maxUploadersRes[uploader] and newUploaderResValue > maxUploadersRes[uploader]', () => {
      service.setMaxFilesAmount(100, 'someUploader');

      const result = service.checkFilesAmount(200, 'someUploader');

      // потому что newUploaderResValue (200) > maxUploadersRes[uploader] (100)
      expect(result).toEqual({
        isValid: false,
        reason: CheckFailedReasons.uploaderRestriction
      });
    });

    it('returns { isValid: true } if NOT totalMax and NOT maxUploadersRes[uploader]', () => {
      const result = service.checkFilesAmount(200, 'someUploader');

      expect(result).toEqual({
        isValid: true,
      });
    });

    it('returns { isValid: true } if totalMax and newTotal <= totalMax', () => {
      service.setMaxFilesAmount(200, Uploaders.total);

      let result = service.checkFilesAmount(100, '');

      // потому что newTotal (100) <= totalMax (200)
      expect(result).toEqual({
        isValid: true,
      });

      result = service.checkFilesAmount(200, '');

      // потому что newTotal (200) <= totalMax (200)
      expect(result).toEqual({
        isValid: true,
      });
    });

    it('returns { isValid: true } if totalMax and newTotal >= 0', () => {
      service.setMaxFilesAmount(100, Uploaders.total);

      let result = service.checkFilesAmount(0, '');

      // потому что newTotal (0) >= 0
      expect(result).toEqual({
        isValid: true,
      });

      result = service.checkFilesAmount(10, '');

      // потому что newTotal (10) >= 0
      expect(result).toEqual({
        isValid: true,
      });
    });

    it('returns { isValid: true } if maxUploadersRes[uploader] and newUploaderResValue >= 0', () => {
      service.setMaxFilesAmount(100, 'someUploader');

      let result = service.checkFilesAmount(0, 'someUploader');

      // потому что newUploaderResValue (0) >= 0
      expect(result).toEqual({
        isValid: true
      });

      result = service.checkFilesAmount(10, 'someUploader');

      // потому что newUploaderResValue (10) >= 0
      expect(result).toEqual({
        isValid: true
      });
    });

    it('returns { isValid: true } if maxUploadersRes[uploader] and newUploaderResValue <= maxUploadersRes[uploader]', () => {
      service.setMaxFilesAmount(100, 'someUploader');

      let result = service.checkFilesAmount(50, 'someUploader');

      // потому что newUploaderResValue (50) <= maxUploadersRes[uploader] (100)
      expect(result).toEqual({
        isValid: true
      });

      result = service.checkFilesAmount(100, 'someUploader');

      // потому что newUploaderResValue (100) <= maxUploadersRes[uploader] (100)
      expect(result).toEqual({
        isValid: true
      });
    });
  });
});
