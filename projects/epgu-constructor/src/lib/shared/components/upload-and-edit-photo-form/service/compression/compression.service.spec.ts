import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import {
  ConfigService,
  ConfigServiceStub,
  DeviceDetectorService,
  DeviceDetectorServiceStub,
  HealthService,
  HealthServiceStub,
} from '@epgu/epgu-constructor-ui-kit';
import { CompressionService, testImageURL } from './compression.service';
import { TerraByteApiService } from '../../../../../core/services/terra-byte-api/terra-byte-api.service';
import { LOAD_FAILURE_SRC, LOAD_SUCCESS_SRC } from './compression.mock';

describe('CompressionService', () => {
  beforeAll(() => {
    Object.defineProperty(window.Image.prototype, 'src', {
      set(src) {
        if (src === LOAD_FAILURE_SRC) {
          setTimeout(() => this.onerror());
        } else if (src === '') {
          setTimeout(() => this.onload());
        } else if (src === LOAD_SUCCESS_SRC) {
          setTimeout(() => this.onload());
        }
      },
    });
  });

  let service: CompressionService;
  let terraByteApiService: TerraByteApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CompressionService,
        TerraByteApiService,
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: HealthService, useClass: HealthServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(CompressionService);
    terraByteApiService = TestBed.inject(TerraByteApiService);
    jest.spyOn(service, 'isAutoOrientationInBrowser' as any).mockResolvedValue(true);
  });

  describe('isValidImageType', () => {
    it('should be return true', () => {
      const file = new File([], 'image', { type: 'image' });
      const isValid = service.isValidImageType(file);
      expect(isValid).toBeTruthy();
    });

    it('should be return false', () => {
      const file = new File([], 'txt', { type: 'txt' });
      const isValid = service.isValidImageType(file);
      expect(isValid).toBeFalsy();
    });

    it('should return false because unsupported image types', () => {
      const file = new File([], 'tiff', { type: 'image/TIFF' });
      const isValid = service.isValidImageType(file);
      expect(isValid).toBeFalsy();
    });
  });

  describe('imageCompression', () => {
    const testImageFile = TerraByteApiService.base64toBlob(LOAD_SUCCESS_SRC);

    it('should return file with max size 1MB and custom name and another fileType', async () => {
      const file = await service.imageCompression(testImageFile, {
        maxSizeMB: 1,
        customFileName: 'customName',
        fileType: 'png',
      });

      expect(file).toBeTruthy();
      expect(file.size).toBeLessThanOrEqual(1);
      expect((file as File).name).toBe('customName');
      expect(file.type.includes('png')).toBeTruthy();
    });
  });

  describe('imageCompression error', () => {
    it('should be return error if file not instance of Blob', async () => {
      try {
        await service.imageCompression({} as any, {});
      } catch (error) {
        expect(error.message).toBe('The given file is not an instance of Blob or File');
      }
    });

    it('should be return error if image is not valid', async () => {
      try {
        const file = new File([], 'txt', { type: 'txt' });
        await service.imageCompression(file, {});
      } catch (error) {
        expect(error.message).toBe('The given file is not a valid image');
      }
    });

    it('should be return error if image is not valid with deepChecking', async () => {
      try {
        URL.createObjectURL = () => LOAD_FAILURE_SRC;
        URL.revokeObjectURL = jest.fn();
        const file = new File([], 'image', { type: 'image' });
        await service.imageCompression(file, { deepChecking: true });
      } catch (error) {
        expect(error.message).toBe('The given file is not a valid image');
      }
    });
  });

  describe('isValidImage()', () => {
    it('should return false', async () => {
      const file = new File([], 'txt', { type: 'txt' });

      const res = await service['isValidImage'](file);

      expect(res).toEqual(false);
    });

    it('should return true', async () => {
      const file = new File([], 'image', { type: 'image' });

      const res = await service['isValidImage'](file);

      expect(res).toEqual(true);
    });

    it('should return true if deep checking', async () => {
      const file = new File([], 'image', { type: 'image' });

      const spy = jest.spyOn<any, any>(service, 'addImageProcess').mockReturnValueOnce(true);

      const res = await service['isValidImage'](file, true);

      expect(res).toEqual(true);
      expect(spy).toHaveBeenCalledWith(file);
    });
  });

  it('getFilefromDataUrl() - conversion check', async () => {
    const file = await service['getFilefromDataUrl'](testImageURL, 'txt');

    const dataUrl = await service['getDataUrlFromFile'](file);

    expect(dataUrl).toEqual(testImageURL);
  });
});
