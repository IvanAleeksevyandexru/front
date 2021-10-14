import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';

@Injectable({ providedIn: 'root' })
export class FileSaverService {
  saveFile(response: HttpResponse<Blob>, params: { filename?: string } = {}): void {
    const contentDisposition = response.headers?.get('content-disposition');
    const filename =
      params.filename || contentDisposition?.match('filename="(.+?)"')?.[1] || 'document.pdf';
    saveAs(response.body, decodeURI(filename));
  }
}
