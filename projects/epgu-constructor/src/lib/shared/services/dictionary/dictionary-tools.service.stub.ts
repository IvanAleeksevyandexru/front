import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { CustomListDropDowns } from '../../../component/custom-screen/components-list.types';

@Injectable()
export class DictionaryToolsServiceStub {
  private _dropDowns$ = new BehaviorSubject<CustomListDropDowns>([]);

  get dropDowns$(): Observable<{}> {
    return this._dropDowns$;
  }
}
