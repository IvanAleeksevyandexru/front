import { Injectable } from '@angular/core';

import { minSize, printImgPx, recommendedDPI } from '../../upload-and-edit-photo-form.constant';
import { ComponentValidationDto } from '@epgu/epgu-constructor-types/src/base/component-attrs';

@Injectable()
export class ValidationService {
  validateImage(
    fileName: string,
    allowedImgTypes: string[],
    width: number,
    height: number,
    validations: Array<ComponentValidationDto>,
  ): {
    isTypeValid: boolean;
    isSizeValid: boolean;
    isDPIValid: boolean;
    fileNameErrorMsg: string | null;
  } {
    return {
      isTypeValid: this.isTypeValid(allowedImgTypes, fileName),
      isSizeValid: this.isSizeValid(width, height),
      isDPIValid: this.isDPIValid(height),
      fileNameErrorMsg: this.validateFileName(fileName, validations),
    };
  }

  isDPIValid(height: number): boolean {
    const scaleFactor = printImgPx.height / height;
    const scaledDPI = Math.ceil(recommendedDPI / scaleFactor);
    return scaledDPI >= recommendedDPI;
  }

  isTypeValid(allowedImgTypes: string[], fileName: string): boolean {
    const imageType = (fileName || '').split('.').pop();

    return allowedImgTypes.some(
      (allowedType) => allowedType.toLowerCase() === imageType.toLowerCase(),
    );
  }

  isSizeValid(width: number, height: number): boolean {
    return (
      (width >= minSize.width && height >= minSize.height) ||
      (width >= minSize.height && height >= minSize.width)
    );
  }

  getImageError(
    isSizeValid: boolean,
    isTypeValid: boolean,
    isDPIValid: boolean,
    width: number,
    height: number,
    fileNameErrorMsg: string | null,
    allowedImgTypes: string[],
  ): string[][] {
    const imageErrors = [];
    if (!isTypeValid) {
      imageErrors.push(['fileType', allowedImgTypes.join(', ')]);
    }
    if (!isSizeValid && width && height) {
      imageErrors.push(['size']);
    }
    if (!isDPIValid) {
      imageErrors.push(['dpi']);
    }
    if (!!fileNameErrorMsg) {
      imageErrors.push(['fileName', fileNameErrorMsg]);
    }
    if (!imageErrors.length) {
      imageErrors.push(['common']);
    }
    return imageErrors;
  }

  validateFileName(fileName: string, validations?: Array<ComponentValidationDto>): string | null {
    if (!validations || validations.length === 0) return null;

    return (
      validations.find(({ value }) => !new RegExp(value).test(fileName))?.errorMsg || null
    );
  }
}
