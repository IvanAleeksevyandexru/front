import { Injectable } from '@angular/core';
import { Location } from '@angular/common';

@Injectable()
export class LocationServiceStub extends Location {
  href(): void {}

  getHref(): void {}

  getOrigin(): string {
    return 'https://host.com';
  }

  reload(): void {}

  deleteParam(): void {}

  hasParam(): void {}

  getParamValue(): void {}
}
