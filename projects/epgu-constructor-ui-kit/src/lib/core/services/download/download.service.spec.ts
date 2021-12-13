import { TestBed } from '@angular/core/testing';
import { DownloadService } from './download.service';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as FileSaver from 'file-saver';

describe('DownloadService', () => {
  let service: DownloadService;
  let httpMock: HttpTestingController;
  const fakeFile = new Blob(['fake'], { type: 'text/plain' });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DownloadService,
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(DownloadService);
    httpMock = TestBed.inject(HttpTestingController);
    jest
      .spyOn(FileSaver, 'saveAs')
      .mockClear()
      .mockImplementation(() => undefined);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('downloadFile()', () => {
    const spy = jest.spyOn(service, 'saveFile');
    service.downloadFile('/url').subscribe(() => {
      expect(spy).toBeCalled();
    });
    const req = httpMock.expectOne('/url');
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('blob');
  });

  it('saveRawFile() calls saveAs', () => {
    const spy = jest.spyOn(FileSaver, 'saveAs');
    const file = '1234567890';
    const type = 'txt';
    const filename = 'text';
    const blob = new Blob([file], { type });
    service.saveRawFile(file, type, filename);
    expect(spy).toHaveBeenCalledWith(blob, filename);
  });

  it('saveFile with default fileName', () => {
    const fakeHttpResponse = new HttpResponse({ status: 200, body: fakeFile });
    service.saveFile(fakeHttpResponse);
    expect(FileSaver.saveAs).toHaveBeenCalledWith(fakeFile, 'document.pdf');

    const headers = new HttpHeaders({ 'content-disposition': 'attachment' });
    const fakeHttpResponseWithHeaders = new HttpResponse({
      status: 200,
      body: fakeFile,
      headers,
    });
    service.saveFile(fakeHttpResponseWithHeaders);
    expect(FileSaver.saveAs).toHaveBeenCalledWith(fakeFile, 'document.pdf');
  });

  it('saveFile with fileName', () => {
    const headers = new HttpHeaders({ 'content-disposition': 'attachment; filename="test.pdf"' });
    const fakeHttpResponse = new HttpResponse({
      status: 200,
      body: fakeFile,
      headers,
    });
    service.saveFile(fakeHttpResponse);
    expect(FileSaver.saveAs).toHaveBeenCalledWith(fakeFile, 'test.pdf');
  });
});
