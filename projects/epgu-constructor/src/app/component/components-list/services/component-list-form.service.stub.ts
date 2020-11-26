import { EventEmitter, Injectable } from '@angular/core';
import { FormArray } from '@angular/forms';
import { CustomComponentOutputData, CustomListStatusElements } from '../components-list.types';

@Injectable()
export class ComponentListFormServiceStub {
  private _form = new FormArray([]);
  private _shownElements: CustomListStatusElements = {};
  private _changes = new EventEmitter<CustomComponentOutputData>();

  get shownElements(): CustomListStatusElements {
    return this._shownElements;
  }
  get form(): FormArray {
    return this._form;
  }
  get changes(): EventEmitter<CustomComponentOutputData> {
    return this._changes;
  }
}
