import { Injectable } from '@angular/core';

@Injectable()
export class AppNavigationRuleServiceStub {
  public initRule(): void {}

  public getFirst(): string {
    return 'firstComponent';
  }

  public getLast(): string {
    return 'lastComponent';
  }

  public getNext(): string {
    return '';
  }

  public getPrev(): string {
    return '';
  }
}
