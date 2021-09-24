import { Injectable } from '@angular/core';

@Injectable()
export class JsonHelperServiceStub {
  public getHiddenBlock(): void {
  }

  tryToParse(value: string | object | []) {
    return value;
  }
}
