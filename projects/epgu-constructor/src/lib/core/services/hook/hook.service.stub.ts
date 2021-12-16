import { Injectable } from '@angular/core';
import { NavigationPayload } from '@epgu/epgu-constructor-types';
import { ObservableInput } from 'rxjs';
import { HookTypes } from './hook.constants';

@Injectable({
  providedIn: 'root',
})
export class HookServiceStub {
  private hooks = {};

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor,@typescript-eslint/no-empty-function
  constructor() {}

  public hasHooks(type: HookTypes): boolean {
    return false;
  }

  public addHook(type: HookTypes, observable: ObservableInput<NavigationPayload>): void {}

  public getHooks(type: HookTypes): ObservableInput<NavigationPayload>[] {
    return [];
  }

  public clearHook(type: HookTypes): void {}

  public clearHooks(): void {}
}
