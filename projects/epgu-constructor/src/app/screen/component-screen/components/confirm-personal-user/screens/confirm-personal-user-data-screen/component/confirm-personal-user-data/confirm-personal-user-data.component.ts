import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import {
  ConfirmUserDataFieldsState,
  ConfirmUserData,
} from '../../../../../../types/confirm-user-data.types';
import { ConfigService } from '../../../../../../../../config/config.service';
import { ComponentScreenComponentTypes } from '../../../../../../component-screen.types';

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
      const { states } = JSON.parse(this.data.value);
      this.preparedData = states;
    }
  }

  public hasAction(): boolean {
    return (
      this.data?.attrs?.actions?.length === 1 &&
      this.data.type === ComponentScreenComponentTypes.confirmPersonalUserData
    );
  }
}
