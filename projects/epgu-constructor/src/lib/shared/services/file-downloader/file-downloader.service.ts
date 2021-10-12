import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FileSaverService } from './file-saver.service';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class FileDownloaderService {
  constructor(private http: HttpClient, private fileSaver: FileSaverService) {}

  download(href: string, filename?: string): Observable<HttpResponse<Blob>> {
    const req = this.http
      .get(href, { responseType: 'blob', observe: 'response' })
      .pipe(shareReplay(1));
    req.subscribe((response) => this.fileSaver.saveFile(response, { filename }));
    return req;
  }
}
