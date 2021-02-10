import { Injectable } from '@angular/core';

import { minSize, printImgPx, recommendedDPI } from '../../upload-and-edit-photo-form.constant';

@Injectable()
export class ValidationService {
  validateImage(
    fileName: string,
    allowedImgTypes: string[],
    width: number,
    height: number,
  ): {
    isTypeValid: boolean;
    isSizeValid: boolean;
    isDPIValid: boolean;
  } {
    return {
      isTypeValid: this.isTypeValid(allowedImgTypes, fileName),
      isSizeValid: this.isSizeValid(width, height),
      isDPIValid: this.isDPIValid(height),
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
    if (!imageErrors.length) {
      imageErrors.push(['common']);
    }
    return imageErrors;
  }
}