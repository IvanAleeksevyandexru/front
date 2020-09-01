import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import {
  ConfirmUserDataFieldsStateInterface,
  ConfirmUserDataInterface,
} from '../../../../../../../../../interfaces/confirm-user-data.interface';
import { ConstructorConfigService } from '../../../../../../../../services/config/constructor-config.service';
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
  preparedData: Array<ConfirmUserDataFieldsStateInterface> = [];

  @Input() data: ConfirmUserDataInterface;
  @Output() dataChange = new EventEmitter();
  constructor(public constructorConfigService: ConstructorConfigService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.data?.currentValue) {
      this.preparedData = this.adaptiveData(this.data);
      this.dataChange.emit(this.preparedData);
    }
  }

  private adaptiveData(data: ConfirmUserDataInterface) {
    const fullName = getFullNameConfirmPersonalUserData(data);
    const birthDay = getBirthDayConfirmPersonalUserData(data);
    const otherFields = getOtherFieldsConfirmPersonalUserData(data);

    return [
      { groupName: fullName, list: [birthDay] },
      { groupName: 'Паспорт гражданина РФ', list: otherFields },
    ];
  }
}
