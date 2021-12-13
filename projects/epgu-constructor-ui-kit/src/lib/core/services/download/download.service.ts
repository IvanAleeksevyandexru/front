import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable()
export class DownloadService {
  constructor(private http: HttpClient) {}

  public downloadFile(url: string, filename?: string): Observable<HttpResponse<Blob>> {
    const req = this.http
      .get(url, { responseType: 'blob', observe: 'response' })
      .pipe(shareReplay(1));
    req.subscribe((response) => this.saveFile(response, { filename }));

    return req;
  }

  public saveFile(response: HttpResponse<Blob>, params: { filename?: string } = {}): void {
    const contentDisposition = response.headers?.get('content-disposition');
    const blob = response.body;
    const filename =
      params.filename || contentDisposition?.match('filename="(.+?)"')?.[1] || 'document.pdf';

    saveAs(blob, decodeURI(filename));
  }

  public saveRawFile(value: string, type: string, filename?: string): void {
    const isBase64 = type.includes(';base64');
    const data = isBase64 ? this.convertBase64(value) : value;
    // на мобилке не работает, если не обрезать тип
    const fileType = isBase64 ? type.replace(';base64', '') : type;
    const blob = new Blob([data], { type: fileType });

    saveAs(blob, decodeURI(filename));
  }

  private convertBase64(value: string): Uint8Array {
    return new Uint8Array(
      window
        .atob(value)
        .split('')
        .map((char) => char.charCodeAt(0)),
    );
  }
}
