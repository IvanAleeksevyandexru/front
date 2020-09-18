import { Injectable } from '@angular/core';
import { checkOgrn } from 'ru-validation-codes';
import { CustomScreenComponentTypes } from '../custom-screen.types';

export class ValidationValueService {
  customcomponentType = CustomScreenComponentTypes;
  isValueValid(type, value): boolean {
    if (type === this.customcomponentType.OgrnInput) {
      return checkOgrn(value);
    }
  }
}
