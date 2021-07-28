import { Injectable } from '@angular/core';
import { NavigationPayload } from '../../../form-player/form-player.types';
import { ObservableInput, of } from 'rxjs';
import { HookTypes } from './hook.constants';

@Injectable({
  providedIn: 'root'
})
export class HookServiceStub {
  private hooks = {};

  constructor() { }

  public hasHooks(type: HookTypes): boolean {
    return false;
  }

  public addHook(type: HookTypes, observable: ObservableInput<NavigationPayload>): void {}

  public getHooks(type: HookTypes): Array<ObservableInput<NavigationPayload>> {
    return [];
  }

  public clearHook(type: HookTypes): void {}

  public clearHooks(): void {}
}
