import { Injectable } from '@angular/core';
import { Location } from '@angular/common';

@Injectable()
export class LocationServiceStub extends Location {
  href(): void {}

  getHref(): string {
    return 'https://host.com/600101/1/form';
  }

  getOrigin(): string {
    return 'https://host.com';
  }

  reload(): void {}

  deleteParam(): void {}

  hasParam(): void {}

  getParamValue(): void {}
}
