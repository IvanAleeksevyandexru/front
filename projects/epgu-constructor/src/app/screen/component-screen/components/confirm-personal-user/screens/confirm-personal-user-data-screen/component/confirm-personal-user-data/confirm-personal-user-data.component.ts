import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import {
  ConfirmUserDataFieldsState,
  ConfirmUserData,
  ConfirmUserDataState,
} from '../../../../../../types/confirm-user-data.types';
import { ConfigService } from '../../../../../../../../config/config.service';
import { ScreenService } from '../../../../../../../screen.service';
import { ActionType } from '../../../../../../../../services/api/form-player-api/form-player-api.types';

@Component({
  selector: 'epgu-constructor-confirm-personal-user-data',
  templateUrl: './confirm-personal-user-data.component.html',
  styleUrls: ['./confirm-personal-user-data.component.scss'],
})
export class ConfirmPersonalUserDataComponent implements OnChanges {
  // <-- variable
  preparedData: Array<ConfirmUserDataFieldsState> = [];
  actionType = ActionType;

  @Input() data: ConfirmUserData;
  constructor(public config: ConfigService, public screenService: ScreenService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.data?.currentValue) {
      const { states } = JSON.parse(this.data.value) as ConfirmUserDataState;
      this.preparedData = states;
    }
  }
}
