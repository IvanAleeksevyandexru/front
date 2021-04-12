import { TestBed } from '@angular/core/testing';
import { FileDownloaderService } from './file-downloader.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FileSaverService } from './file-saver.service';

describe('FileDownloaderService', () => {
  let service: FileDownloaderService;
  let httpMock: HttpTestingController;
  let fileSaver: FileSaverService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FileDownloaderService, FileSaverService],
    });
    service = TestBed.inject(FileDownloaderService);
    httpMock = TestBed.inject(HttpTestingController);
    fileSaver = TestBed.inject(FileSaverService);
  });

  it('download()', () => {
    jest.spyOn(fileSaver, 'saveFile');
    service.download('/url').subscribe(() => {
      expect(fileSaver.saveFile).toBeCalled();
    });
    const req = httpMock.expectOne('/url');
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('blob');
  });
});
