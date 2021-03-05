import { EventEmitter, Injectable } from '@angular/core';
import { FormArray } from '@angular/forms';

import { CustomComponentOutputData } from '../../components/components-list/components-list.types';

@Injectable()
export class ComponentListFormServiceStub {
  private _form = new FormArray([]);
  private _changes = new EventEmitter<CustomComponentOutputData>();

  get form(): FormArray {
    return this._form;
  }
  get changes(): EventEmitter<CustomComponentOutputData> {
    return this._changes;
  }
}
