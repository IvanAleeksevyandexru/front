import { EventEmitter, Injectable } from '@angular/core';
import { FormArray } from '@angular/forms';

import { CustomComponentOutputData, CustomListStatusElements } from '../../components-list.types';

@Injectable()
export class ComponentsListFormServiceStub {
  private _form = new FormArray([]);
  private _changes = new EventEmitter<CustomComponentOutputData>();
  private _shownElements: CustomListStatusElements = {};

  get form(): FormArray {
    return this._form;
  }

  // for simplify stubbing
  set form(form: FormArray) {
    this._form = form;
  }

  get changes(): EventEmitter<CustomComponentOutputData> {
    return this._changes;
  }

  get shownElements(): CustomListStatusElements {
    return this._shownElements;
  }

  emitChanges() {}
}
