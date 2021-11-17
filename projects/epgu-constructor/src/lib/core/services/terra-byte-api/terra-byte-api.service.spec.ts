import { TestBed } from '@angular/core/testing';
import { TerraByteApiService } from './terra-byte-api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { ConfigServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { of } from 'rxjs';
import {
  Chunk,
  ChunkPacket,
  TerabyteListItem,
  TerraUploadFileOptions,
} from './terra-byte-api.types';
import * as FileSaver from 'file-saver';
import { TerraUploadedFile } from '../../../shared/components/file-upload/data';

const createMockBlob = (size: number): Blob => {
  const mockObj = { size, type: 'application/file' };
  return {
    ...mockObj,
    slice() {
      return mockObj as Blob;
    },
  } as Blob;
};

const teraByteItemSample: TerabyteListItem = {
  fileName: 'some fileName',
  objectId: 'some objectId',
  objectTypeId: 1,
  mnemonic: 'some mnemonic',
  updated: 'some updated',
  fileSize: 100,
  alternativeMimeTypes: [],
  created: 'some created',
  deleted: false,
  fileExt: 'some fileExt',
  fileUid: 1,
  hasSign: true,
  metaId: 1,
  nodeId: 'some nodeId',
  realPath: 'some realPath',
  relativePath: 'some relativePath',
  userId: 1,
};

const teraByteListSample: TerabyteListItem[] = [teraByteItemSample];

const imageBase64Sample =
  'data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUA\n' +
  '    AAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO\n' +
  '        9TXL0Y4OHwAAAABJRU5ErkJggg==';

describe('TerraByteApiService', () => {
  let service: TerraByteApiService;
  let http: HttpTestingController;
  let configService: ConfigServiceStub;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TerraByteApiService, { provide: ConfigService, useClass: ConfigServiceStub }],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(TerraByteApiService);
    http = TestBed.inject(HttpTestingController);

    configService = (TestBed.inject(ConfigService) as unknown) as ConfigServiceStub;
    configService._fileUploadApiUrl = '/file-upload-api';
  });

  afterEach(() => {
    http.verify();
  });

  it('chunkSize property should be 6MB', () => {
    // 6291456 - количество байт в 6 мбайтах.
    expect(service.chunkSize).toBe(6291456);
  });

  it('chunkPacketMaxSize should be 1', () => {
    expect(service.chunkPacketMaxSize).toBe(1);
  });

  describe('base64toBlob() method', () => {
    it('should return BLOB', () => {
      const blob = TerraByteApiService.base64toBlob(imageBase64Sample);

      expect(blob).toBeInstanceOf(Blob);
      expect(blob.size).toBe(85); // 85 байт в imageBase64Sample
    });

    it('should detect type if type is not provided', () => {
      const blob = TerraByteApiService.base64toBlob(imageBase64Sample);
      expect(blob.type).toBe('image/png');
    });

    it('should set type if type is provided', () => {
      const blob = TerraByteApiService.base64toBlob(imageBase64Sample, 'image/jpeg');
      expect(blob.type).toBe('image/jpeg');
    });
  });

  it('getListByObjectId() method', (done) => {
    service.getListByObjectId('some-id').subscribe((res) => {
      expect(res).toBe(teraByteListSample);
      done();
    });

    const req = http.expectOne('/file-upload-api/some-id');
    expect(req.request.method).toBe('GET');
    req.flush(teraByteListSample);
  });

  it('getGalleryByMnemonic() method', (done) => {
    service.getGalleryByMnemonic('mnemonic').subscribe((res) => {
      expect(res).toBe(teraByteListSample);
      done();
    });

    const req = http.expectOne('/mnemonic/files');
    expect(req.request.method).toBe('GET');
    req.flush(teraByteListSample);
  });

  it('getFileInfo() method', (done) => {
    service
      .getFileInfo({
        objectId: 'some-id',
        objectType: 1,
        mnemonic: 'someMnemonic',
      })
      .subscribe((res) => {
        expect(res).toBe(teraByteItemSample);
        done();
      });

    const req = http.expectOne('/file-upload-api/some-id/1?mnemonic=someMnemonic');
    expect(req.request.method).toBe('GET');
    req.flush(teraByteItemSample);
  });

  it('uploadForm() method', (done) => {
    const form = {} as FormData;

    service.uploadForm(form).subscribe(() => {
      done();
    });

    const req = http.expectOne('/file-upload-api/upload');
    expect(req.request.method).toBe('POST');
    req.flush(null);
  });

  it('createChunk() method', () => {
    const blobMock = createMockBlob(10001);
    blobMock.slice = jest.fn();
    const chunks = 11;
    service.chunkSize = 1000;

    jest.spyOn(service, 'createFormData').mockReturnValue({} as FormData);

    let result = service.createChunk([0, chunks, blobMock, {} as TerraUploadFileOptions]);
    expect(blobMock.slice).toHaveBeenCalledWith(0, 1000);

    expect(result).toEqual({
      chunk: 0,
      form: {},
    });

    result = service.createChunk([10, chunks, blobMock, {} as TerraUploadFileOptions]);
    expect(blobMock.slice).toHaveBeenCalledWith(10000, 10001);

    expect(result).toEqual({
      chunk: 10,
      form: {},
    });
  });

  it('accumuleChunkPacket() method', () => {
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

  describe('uploadFile() method', () => {
    it('should return uploadByChunkFile() result if file.size > service.chunkSize', () => {
      service.chunkSize = 1000;

      const uploadByChunkFileObservable = of(undefined);

      jest.spyOn(service, 'uploadByChunkFile').mockReturnValue(uploadByChunkFileObservable);

      const options = {} as TerraUploadFileOptions;
      const mockBlob = createMockBlob(10001);

      let result = service.uploadFile(options, mockBlob);
      expect(result).toBe(uploadByChunkFileObservable);
      expect(service.uploadByChunkFile).toHaveBeenCalledWith(options, mockBlob);
    });

    it('should return uploadForm() result if file.size <= service.chunkSize', () => {
      service.chunkSize = 1000;

      const form = {} as FormData;
      const uploadFormObservable = of(undefined);

      jest.spyOn(service, 'uploadForm').mockReturnValue(uploadFormObservable);
      jest.spyOn(service, 'createFormData').mockReturnValue(form);

      let result = service.uploadFile({} as TerraUploadFileOptions, createMockBlob(1000));
      expect(result).toBe(uploadFormObservable);
      expect(service.uploadForm).toHaveBeenCalledWith(form);

      (service.uploadForm as jest.Mock).mockClear();
      result = service.uploadFile({} as TerraUploadFileOptions, createMockBlob(999));
      expect(result).toBe(uploadFormObservable);
      expect(service.uploadForm).toHaveBeenCalledWith(form);
    });
  });

  describe('uploadByChunkFile() method', () => {
    it('should call uploadForm()', (done) => {
      service.chunkSize = 2;

      const file = new File(['1234567890'], 'someFileName');

      jest.spyOn(service, 'uploadForm').mockReturnValue(of(undefined));

      service
        .uploadByChunkFile(
          {
            name: 'some name',
            objectId: 'some-id',
            objectType: 1,
            mnemonic: 'someMnemonic',
          },
          file,
        )
        .subscribe((res) => {
          done();
        });

      expect(service.uploadForm).toBeCalledTimes(5); // 10 / 2 (10 - размер файла, 2 - размер чанка)
    });
  });

  it('createFormData() method', () => {
    const file = new File(['1234567890'], 'someFileName');

    const form = service.createFormData(
      {
        name: 'some name',
        objectId: 'some-id',
        objectType: 1,
        mnemonic: 'someMnemonic',
      },
      file,
    );

    expect(form).toBeInstanceOf(FormData);

    expect(form.get('file')).toEqual(file);
    expect(form.get('name')).toBe('some name');
    expect(form.get('objectId')).toBe('some-id');
    expect(form.get('objectType')).toBe('1');
    expect(form.get('mnemonic')).toBe('someMnemonic');
  });

  it('deleteFile() method', (done) => {
    const file = {} as TerraUploadedFile;

    service
      .deleteFile({
        objectId: 'some-id',
        objectType: 1,
        mnemonic: 'someMnemonic',
      })
      .subscribe((res) => {
        expect(res).toBe(file);
        done();
      });

    const req = http.expectOne('/file-upload-api/some-id/1?mnemonic=someMnemonic');
    expect(req.request.method).toBe('DELETE');
    req.flush(file);
  });

  it('getDownloadApiPath() method', () => {
    expect(
      service.getDownloadApiPath({
        objectId: 'some-id',
        objectType: 1,
        mnemonic: 'someMnemonic',
      }),
    ).toBe('/file-upload-api/some-id/1/download?mnemonic=someMnemonic');
  });

  it('downloadFile() method', (done) => {
    const blob = new Blob(['foo'], { type: 'text/plain' });

    service
      .downloadFile({
        objectId: 'some-id',
        objectType: 1,
        mnemonic: 'someMnemonic',
      })
      .subscribe((res) => {
        expect(res).toBe(blob);
        done();
      });

    const req = http.expectOne('/file-upload-api/some-id/1/download?mnemonic=someMnemonic');
    expect(req.request.method).toBe('GET');
    req.flush(blob);
  });

  describe('pushFileToBrowserForDownload() method', () => {
    it('should save file without mimeType', () => {
      const blob = new Blob(['foo']);

      jest
        .spyOn(FileSaver, 'saveAs')
        .mockClear()
        .mockImplementation(() => undefined);

      service.pushFileToBrowserForDownload(blob, {
        fileName: 'some file name',
      } as TerraUploadedFile);

      expect(FileSaver.saveAs).toBeCalledTimes(1);
      expect(FileSaver.saveAs).toBeCalledWith(blob, 'some file name');
    });

    it('should save file with mimeType', () => {
      const blob = new Blob(['foo']);

      jest
        .spyOn(FileSaver, 'saveAs')
        .mockClear()
        .mockImplementation((file) => {
          const updatedBlob = file as Blob;
          expect(updatedBlob.type).toBe('text/plain');
        });

      service.pushFileToBrowserForDownload(blob, {
        fileName: 'some file name',
        mimeType: 'text/plain',
      } as TerraUploadedFile);

      expect(FileSaver.saveAs).toBeCalledTimes(1);
      expect(FileSaver.saveAs).toBeCalledWith(blob, 'some file name');
    });
  });
});
