import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { from, Observable, throwError } from 'rxjs';

@Injectable()
export class WebcamService {
  isWebcamAllowed(): Observable<boolean> {
    return from(navigator?.mediaDevices?.getUserMedia({ video: true }) || [false]).pipe(
      catchError((e) => {
        // eslint-disable-next-line no-restricted-syntax
        console.info('Camera error', e);
        return throwError(false);
      }),
      map((stream) => {
        if (stream instanceof MediaStream) {
          stream.getTracks().forEach((track) => track.stop());
        }
        return Boolean(stream);
      }),
    );
  }
}
