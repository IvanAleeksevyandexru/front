import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class ErrorService {
  public errorEmitter = new Subject<Error>();

  public handleError(err: Error | string) {
    if (typeof err === 'string') {
      err = new Error(err);
    }
    this.errorEmitter.next(err);
  }
}
