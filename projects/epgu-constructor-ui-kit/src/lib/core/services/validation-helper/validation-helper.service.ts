import { Injectable } from '@angular/core';

@Injectable()
export class ValidationHelperService {
  public checkBik = (value: unknown): boolean => {
    const strValue = String(value);

    if (!/^\d{9}$/.test(strValue)) {
      return false;
    }

    const thirdPart = strValue.slice(-3);

    if (+thirdPart === 0 || +thirdPart === 1 || +thirdPart === 2) {
      // спец. значения
      return true;
    }

    return +thirdPart >= 50 && +thirdPart < 1000;
  };

  public checkINN = (value: unknown): boolean => {
    const strValue = String(value);

    if (!/^\d{10}$/.test(strValue) && !/^\d{12}$/.test(strValue)) {
      return false;
    }

    const arrValue: number[] = strValue.split('').map(Number);

    return this.isValidINNWith10Signs(arrValue) || this.isValidINNWith12Signs(arrValue);
  };

  public checkOgrn = (value: unknown): boolean => {
    const strValue = String(value);

    if (!/^\d{13}$/.test(strValue)) {
      return false;
    }

    return (
      parseInt((Number(strValue.slice(0, -1)) % 11).toString().slice(-1)) === Number(strValue[12])
    );
  };

  public checkOgrnip = (value: unknown): boolean => {
    const strValue = String(value);

    if (!/^\d{15}$/.test(strValue)) {
      return false;
    }

    return (
      parseInt((Number(strValue.slice(0, -1)) % 13).toString().slice(-1)) === Number(strValue[14])
    );
  };

  public checkSnils = (value: string): boolean => {
    if (!/^\d{3}-\d{3}-\d{3}\s\d{2}$/.test(value)) {
      return false;
    }

    const digitsStr = value.replace(/\D/g, '');
    const checkSum = parseInt(digitsStr.slice(9), 10);
    const digitsArr = digitsStr.substring(0, 9).split('').map(Number);
    const sum = digitsArr.reduce(function (acc, next, index) {
      return acc + next * (9 - index);
    }, 0);

    return (
      (sum < 100 && sum === checkSum) ||
      ((sum === 100 || sum === 101) && checkSum === 0) ||
      (sum > 101 && (sum % 101 === checkSum || (sum % 101 === 100 && checkSum === 0)))
    );
  };

  public checkSnilsOnlyChecksum = (value: unknown): boolean => {
    let result = '';

    if (typeof value === 'number') {
      result = '' + value;
    } else if (typeof value === 'string') {
      result = value.replace(/\D/g, '');
    } else {
      return false;
    }

    if (result.length !== 11) {
      return false;
    }

    result =
      result.slice(0, 3) +
      '-' +
      result.slice(3, 6) +
      '-' +
      result.slice(6, 9) +
      ' ' +
      result.slice(-2);

    return this.checkSnils(result);
  };

  private isValidINNWith10Signs = (arrValue: number[]): boolean => {
    return (
      arrValue.length === 10 &&
      +arrValue[9] ===
        ((2 * arrValue[0] +
          4 * arrValue[1] +
          10 * arrValue[2] +
          3 * arrValue[3] +
          5 * arrValue[4] +
          9 * arrValue[5] +
          4 * arrValue[6] +
          6 * arrValue[7] +
          8 * arrValue[8]) %
          11) %
          10
    );
  };

  private isValidINNWith12Signs = (arrValue: number[]): boolean => {
    return (
      arrValue.length === 12 &&
      +arrValue[10] ===
        ((7 * arrValue[0] +
          2 * arrValue[1] +
          4 * arrValue[2] +
          10 * arrValue[3] +
          3 * arrValue[4] +
          5 * arrValue[5] +
          9 * arrValue[6] +
          4 * arrValue[7] +
          6 * arrValue[8] +
          8 * arrValue[9]) %
          11) %
          10 &&
      +arrValue[11] ===
        ((3 * arrValue[0] +
          7 * arrValue[1] +
          2 * arrValue[2] +
          4 * arrValue[3] +
          10 * arrValue[4] +
          3 * arrValue[5] +
          5 * arrValue[6] +
          9 * arrValue[7] +
          4 * arrValue[8] +
          6 * arrValue[9] +
          8 * arrValue[10]) %
          11) %
          10
    );
  };
}
