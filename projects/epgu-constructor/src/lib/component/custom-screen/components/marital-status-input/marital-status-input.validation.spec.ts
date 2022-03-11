import { FormControl, FormGroup } from '@angular/forms';

import { CustomScreenComponentTypes } from '../../components-list.types';
import {
  checkMaritalStatusRecordYear,
  checkMaritalStatusRecordCS,
} from './marital-status-input.validation';

describe('checkMaritalYear', () => {
  const mockInputComponent = {
    id: 'act_rec_number',
    type: CustomScreenComponentTypes.StringInput,
    label: 'Номер актовой записи',
    attrs: {
      dictionaryType: '',
      ref: [],
      labelAttr: '',
      fields: [],
      validation: [
        {
          type: 'MaritalStatusYear',
          value: '',
          ref: 'act_rec_date',
          dataType: '',
          condition: '',
          errorMsg: 'Разряды 3, 4, 5 должны соотвествовать году актовой записи',
        },
      ],
    },
    value: '',
    required: true,
  };

  it('should return true', () => {
    const form = new FormGroup({
      act_rec_date: new FormControl(new Date('10.12.2018')),
      act_rec_number: new FormControl('120189910001500982002'),
    });

    const isValid = checkMaritalStatusRecordYear(mockInputComponent, form.get('act_rec_number'));

    expect(isValid).toBeTruthy();
  });

  it('should return false', () => {
    const form = new FormGroup({
      act_rec_date: new FormControl(new Date('10.12.2018')),
      act_rec_number: new FormControl('120199910001500982002'),
    });

    const isValid = checkMaritalStatusRecordYear(mockInputComponent, form.get('act_rec_number'));

    expect(isValid).toBeFalsy();
  });
});

describe('checkMaritalStatusRecordCS', () => {
  it('should return true', () => {
    expect(checkMaritalStatusRecordCS('')).toBeTruthy();
    expect(checkMaritalStatusRecordCS('130209910002900532008')).toBeTruthy();
    expect(checkMaritalStatusRecordCS('120189550003401034008')).toBeTruthy();
  });

  it('should return false', () => {
    expect(checkMaritalStatusRecordCS('1201834')).toBeFalsy();
    expect(checkMaritalStatusRecordCS('120189910001500982005')).toBeFalsy();
    expect(checkMaritalStatusRecordCS('120189990001500982007')).toBeFalsy();
  });
});
