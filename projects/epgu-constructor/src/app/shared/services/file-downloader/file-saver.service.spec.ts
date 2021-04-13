import { TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { FileSaverService } from './file-saver.service';
import * as FileSaver from 'file-saver';
import { configureTestSuite } from 'ng-bullet';

describe('FileSaverService', () => {
  let service: FileSaverService;
  const fakeFile = new Blob(['fake'], { type: 'text/plain' });

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [FileSaverService],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(FileSaverService);
    jest
      .spyOn(FileSaver, 'saveAs')
      .mockClear()
      .mockImplementation(() => undefined);
  });

  it('saveFile with default fileName', () => {
    const fakeHttpResponse = new HttpResponse({ status: 200, body: fakeFile });
    service.saveFile(fakeHttpResponse);
    expect(FileSaver.saveAs).toHaveBeenCalledWith(fakeFile, 'document.pdf');

    const headers = new HttpHeaders({ 'content-disposition': 'attachment' });
    const fakeHttpResponseWithHeaders = new HttpResponse({
      status: 200,
      body: fakeFile,
      headers
    });
    service.saveFile(fakeHttpResponseWithHeaders);
    expect(FileSaver.saveAs).toHaveBeenCalledWith(fakeFile, 'document.pdf');
  });

  it('saveFile with fileName', () => {
    const headers = new HttpHeaders({ 'content-disposition': 'attachment; filename="test.pdf"' });
    const fakeHttpResponse = new HttpResponse({
      status: 200,
      body: fakeFile,
      headers
    });
    service.saveFile(fakeHttpResponse);
    expect(FileSaver.saveAs).toHaveBeenCalledWith(fakeFile, 'test.pdf');
  });
});
