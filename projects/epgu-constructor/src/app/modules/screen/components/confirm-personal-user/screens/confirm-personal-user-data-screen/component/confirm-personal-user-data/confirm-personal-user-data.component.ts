import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {
  ConfirmUserDataFieldsInterface,
  ConfirmUserDataInterface,
} from '../../../../../../../../../interfaces/confirm-user-data.interface';

@Component({
  selector: 'epgu-constructor-confirm-personal-user-data',
  templateUrl: './confirm-personal-user-data.component.html',
  styleUrls: ['./confirm-personal-user-data.component.scss'],
})
export class ConfirmPersonalUserDataComponent implements OnInit, OnChanges {
  fullName: string;
  birthDay: ConfirmUserDataFieldsInterface;
  passportFields: Array<ConfirmUserDataFieldsInterface>;
  @Input() data: ConfirmUserDataInterface;

  ngOnInit(): void {
    this.parseData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.data?.currentValue) {
      this.parseData();
    }
  }

  private parseData() {
    this.fullName = this.getFullName(this.data);
    this.birthDay = this.getBirthDay(this.data);
    this.passportFields = this.getPassportFields(this.data);
  }

  private getFullName(data: ConfirmUserDataInterface) {
    return (
      data.attrs.fields
        .filter((item) => ['firstName', 'lastName', 'middleName'].includes(item.fieldName))
        // eslint-disable-next-line no-return-assign, no-param-reassign
        .reduce((acc, item) => (acc += ` ${this.getValue(this.data, item.fieldName)}`), '')
        .trim()
    );
  }

  private getBirthDay(data: ConfirmUserDataInterface): ConfirmUserDataFieldsInterface {
    return data.attrs.fields.find((item) => item.fieldName === 'birthDate');
  }

  private getPassportFields(data: ConfirmUserDataInterface): Array<ConfirmUserDataFieldsInterface> {
    return data.attrs.fields.filter(
      (item) => !['firstName', 'lastName', 'middleName', 'birthDate'].includes(item.fieldName),
    );
  }

  private getValue(data: ConfirmUserDataInterface, fieldName) {
    return JSON.parse(data.value)[fieldName];
  }
}
