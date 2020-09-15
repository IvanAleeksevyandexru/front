import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import {
  ConfirmUserDataFieldsState,
  ConfirmUserData,
} from '../../../../../../types/confirm-user-data.types';
import { ConfigService } from '../../../../../../../../config/config.service';
import {
  getBirthDayConfirmPersonalUserData,
  getFullNameConfirmPersonalUserData,
  getOtherFieldsConfirmPersonalUserData,
} from './confirm-personal-user-data.constant';

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
      this.preparedData = this.adaptiveData(this.data);
    }
  }

  private adaptiveData(data: ConfirmUserData) {
    const fullName = getFullNameConfirmPersonalUserData(data);
    const birthDay = getBirthDayConfirmPersonalUserData(data);
    const otherFields = getOtherFieldsConfirmPersonalUserData(data);

    return [
      { groupName: fullName, list: [birthDay] },
      { groupName: 'Паспорт гражданина РФ', list: otherFields },
    ];
  }
}
