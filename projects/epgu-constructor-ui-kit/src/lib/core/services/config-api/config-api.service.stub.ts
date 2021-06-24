import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ConfigApiService } from './config-api.service';

@Injectable()
export class ConfigApiServiceStub {

  public getFormPlayerConfig(): Observable<{}> {
    return of({});
  }
}
