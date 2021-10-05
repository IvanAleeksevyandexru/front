import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomListDictionaries } from '../../../component/custom-screen/components-list.types';

@Injectable()
export class RestToolsServiceStub {
  private _dictionaries$ = new BehaviorSubject<CustomListDictionaries>([]);

  public get dictionaries$(): BehaviorSubject<CustomListDictionaries> {
    return this._dictionaries$;
  }

  public get dictionaries(): CustomListDictionaries {
    return this._dictionaries$.getValue();
  }

  public loadReferenceData$(): Observable<any> {
    return new Observable();
  }

  public watchForUpdates(): Observable<any> {
    return new Observable();
  }
}
