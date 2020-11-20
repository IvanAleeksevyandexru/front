import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import {
  ConfirmUserDataFieldsState,
  ConfirmUserDataState,
} from '../../../component/component-screen/components/confirm-personal-user/screens/confirm-personal-user-data-screen/confirm-personal-user-data-screen.types';

@Component({
  selector: 'epgu-constructor-field-list',
  templateUrl: './field-list.component.html',
  styleUrls: ['./field-list.component.scss'],
})
export class FieldListComponent implements OnChanges {
  preparedData: Array<ConfirmUserDataFieldsState> = [];

  @Input() data: AbstractControl;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.data?.currentValue) {
      const { states } = JSON.parse(this.data.value) as ConfirmUserDataState;
      this.preparedData = states;
    }
  }
}
