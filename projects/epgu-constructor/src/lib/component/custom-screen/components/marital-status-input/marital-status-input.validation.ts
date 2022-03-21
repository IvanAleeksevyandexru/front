import { AbstractControl } from '@angular/forms';

import { ValidationType } from '../../../../shared/services/validation/validation.service.types';
import { CustomComponent } from '../../components-list.types';

/**
 * Номер актовой записи
 * 3, 4, 5 разряд - последние три цифры календарного года, в котором составлена запись
 */
export const checkMaritalStatusRecordYear = (
  component: CustomComponent,
  control: AbstractControl,
): boolean => {
  const { ref } = component.attrs.validation?.find((validation) => {
    return validation.type === ValidationType.maritalStatusYear;
  });

  if (ref && control) {
    const year = (control.parent?.value[ref] as Date).getFullYear();

    const controlValueYear = control.value.slice(2, 5);
    const refValueYear = String(year).slice(1, 4);

    return controlValueYear && refValueYear && Number(controlValueYear) === Number(refValueYear);
  } else {
    return true;
  }
};

/**
 * Проверка контрольной суммы номера актовой записи
 * https://jira.egovdev.ru/browse/EPGUCORE-86855
 */
export const checkMaritalStatusRecordCS = (value: string): boolean => {
  const check = (checkVal: string): boolean => {
    const coefficients = new Array(10).fill([1, 2]).flat();
    // 1) произведение значения на коэффицент не должно быть больше 9
    const checkDigit = (coefficient: number, digit: number): number => {
      const result = coefficient * digit;
      return result > 9 ? result - 9 : result;
    };

    const checkSum = coefficients.reduce(
      (sum, coefficient, index) => sum + checkDigit(coefficient, parseFloat(checkVal[index])),
      0,
    );

    /**
     * 2) сумма разрядов с 1 по 20, прошедших проверку в шаге 1,
     *  должна при сложении с 21 разрядом делиться на 10 без остатка
     */
    const isCheckSumValid = (checkSum + parseFloat(checkVal[20])) % 10 === 0;

    return isCheckSumValid;
  };

  return value ? check(value) : true;
};
