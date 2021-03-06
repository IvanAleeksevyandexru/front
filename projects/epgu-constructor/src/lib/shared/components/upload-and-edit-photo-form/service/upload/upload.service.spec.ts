import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import {
  ObjectHelperService,
  WordTransformService,
  ConfigService,
  ConfigServiceStub,
  DeviceDetectorService,
  DeviceDetectorServiceStub,
  HealthService,
  HealthServiceStub,
} from '@epgu/epgu-constructor-ui-kit';
import { ComponentUploadedFileDto } from '@epgu/epgu-constructor-types';
import { UploadService } from './upload.service';
import { TerraByteApiService } from '../../../../../core/services/terra-byte-api/terra-byte-api.service';
import { CompressionService } from '../compression/compression.service';

describe('UploadService', () => {
  let service: UploadService;
  let terraByteApiService: TerraByteApiService;
  let compressionService: CompressionService;
  const requestDataMock: ComponentUploadedFileDto = {
    mnemonic: 'd33.PhotoUploadComponent.passport_photo.0',
    name: '',
    objectType: 2,
    objectId: '763643920',
    mimeType: 'image/jpeg',
  };
  const responseDataMock = {
    mnemonic: 'd33.PhotoUploadComponent.passport_photo.0',
    name: 'photo_2020-10-26_12-03-43.jpg',
    objectType: 2,
    objectId: 763643920,
    mimeType: 'image/jpeg',
    fileUid: 1882086535,
    metaId: 1873858446,
    objectTypeId: 2,
    fileName: 'photo_2020-10-26_12-03-43.jpg',
    fileExt: 'jpg',
    fileSize: 36048,
    hasSign: false,
    created: '2021-02-03',
    updated: '2021-02-03',
    realPath: '48/0/0/18/82/8/65/60NYII375eXK',
    deleted: false,
    bucket: 'epgu202102',
    nodeId: 'f_dc',
    userId: 1000415878,
    alternativeMimeTypes: [],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UploadService,
        TerraByteApiService,
        CompressionService,
        WordTransformService,
        ObjectHelperService,
        { provide: HealthService, useClass: HealthServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(UploadService);
    terraByteApiService = TestBed.inject(TerraByteApiService);
    compressionService = TestBed.inject(CompressionService);
    jest.spyOn(TerraByteApiService, 'base64toBlob').mockReturnValue(new Blob([]));
    jest
      .spyOn(compressionService, 'imageCompression')
      .mockReturnValue(Promise.resolve(new Blob([])));
    jest.spyOn(terraByteApiService, 'uploadFile').mockReturnValue(of(null));
    jest.spyOn(terraByteApiService, 'getFileInfo').mockReturnValue(of(responseDataMock as any));
  });

  it('should be upload photo', () => {
    jest.spyOn(terraByteApiService, 'deleteFile').mockReturnValue(of({} as any));

    service.uploadPhotoToServer('fieldList.png', requestDataMock, '').subscribe((response) => {
      expect(response).toEqual(responseDataMock);
    });
  });

  it('should be catch error if file deleted', () => {
    jest.spyOn(terraByteApiService, 'deleteFile').mockReturnValue(throwError(''));

    service.uploadPhotoToServer('', requestDataMock, '').subscribe((response) => {
      expect(response).toEqual(responseDataMock);
    });
  });
});
