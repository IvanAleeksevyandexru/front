import { Injectable } from '@angular/core';

@Injectable()
export class UtilsServiceStub {
  public downloadFile({ value, type }: { value: string; type: string }): void {}
}
