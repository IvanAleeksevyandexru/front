import { Injectable } from '@angular/core';
import { Location } from '@angular/common';

@Injectable()
export class LocationServiceStub extends Location {
  private _href = 'https://host.com/600101/1/form';

  href(): void {}

  getHref(): string {
    return this._href;
  }

  setHref(value: string): void {
    this._href = value;
  }

  getOrigin(): string {
    return 'https://host.com';
  }

  reload(): void {}

  deleteParam(): void {}

  hasParam(): void {}

  getParamValue(): void {}
}
