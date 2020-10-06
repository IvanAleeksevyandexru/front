import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import {
  ConfirmUserDataFieldsState,
  ConfirmUserData,
  ConfirmUserDataState,
} from '../../../../../../types/confirm-user-data.types';
import { ConfigService } from '../../../../../../../../config/config.service';

@Component({
  selector: 'epgu-constructor-confirm-personal-user-data',
  templateUrl: './confirm-personal-user-data.component.html',
  styleUrls: ['./confirm-personal-user-data.component.scss'],
})
export class ConfirmPersonalUserDataComponent implements OnChanges {
  // <-- variable
  preparedData: Array<ConfirmUserDataFieldsState> = [];

  @Input() data: ConfirmUserData;
  constructor(public config: ConfigService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.data?.currentValue) {
      const { states } = JSON.parse(this.data.value) as ConfirmUserDataState;
      this.preparedData = states;
    }
  }
}
