import { TestBed } from '@angular/core/testing';

import { TerraByteApiService } from './terra-byte-api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from '../../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../../core/services/config/config.service.stub';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';
import { DeviceDetectorService } from '../../../../core/services/device-detector/device-detector.service';
import { of } from 'rxjs';
import { Chunk, ChunkPacket, TerraUploadFileOptions } from './terra-byte-api.types';

const createMockBlob = (size: number): Blob => {
  const mockObj = { size, type: 'application/file' };
  return {
    ...mockObj,
    slice() {
      return mockObj as Blob;
    },
  } as Blob;
};

describe('TerraByteApiService', () => {
  let service: TerraByteApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TerraByteApiService,
        UnsubscribeService,
        DeviceDetectorService,
        { provide: ConfigService, useClass: ConfigServiceStub },
      ],
    });
    service = TestBed.inject(TerraByteApiService);
    jest.spyOn(service, 'uploadForm').mockReturnValue(of(undefined));
    jest.spyOn(service, 'createFormData').mockReturnValue({} as FormData);
  });

  it('should be accumuleChunkPacket', () => {
    const form = {} as FormData;
    service.chunkPacketMaxSize = 2;
    //Проверяем запрет на добавление в 1 часть
    expect(
      service.accumuleChunkPacket([[form]] as ChunkPacket[], { chunk: 1, form } as Chunk).length,
    ).toBe(2);
    service.chunkPacketMaxSize = 1;

    //Проверяем максимум в пакете
    expect(
      service.accumuleChunkPacket([[form], [form]] as ChunkPacket[], { chunk: 2, form } as Chunk)
        .length,
    ).toBe(3);
  });

  it('should be create Chunk', () => {
    const blobMock = createMockBlob(10001);
    blobMock.slice = jest.fn();
    const chunks = 11;
    service.chunkSize = 1000;
    service.createChunk([0, chunks, blobMock, {} as TerraUploadFileOptions]);
    expect(blobMock.slice).toHaveBeenCalledWith(0, 1000);
    service.createChunk([10, chunks, blobMock, {} as TerraUploadFileOptions]);
    expect(blobMock.slice).toHaveBeenCalledWith(10000, 10001);
  });

  it('should be uploadFile', () => {
    service.chunkSize = 1000;
    spyOn(service, 'uploadByChunkFile').and.callThrough();
    spyOn(service, 'uploadForm').and.callThrough();
    service.uploadFile({} as TerraUploadFileOptions, createMockBlob(10001));
    expect(service.uploadByChunkFile).toHaveBeenCalled();
    service.uploadFile({} as TerraUploadFileOptions, createMockBlob(1000));
    expect(service.uploadForm).toHaveBeenCalled();
  });
});
