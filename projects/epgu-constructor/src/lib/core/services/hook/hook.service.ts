import { Injectable } from '@angular/core';
import { NavigationPayload } from '../../../form-player/form-player.types';
import { ObservableInput } from 'rxjs';
import { HookTypes } from './hook.constants';

@Injectable({
  providedIn: 'root'
})
export class HookService {
  private hooks: { [key in HookTypes]?: ObservableInput<NavigationPayload>[] } = {};

  constructor() { }

  public addHook(type: HookTypes, observable: ObservableInput<NavigationPayload>): void {
    if (!Array.isArray(this.hooks[type])) {
      this.hooks[type] = [observable];
    } else {
      this.hooks[type].push(observable);
    }
  }

  public hasHooks(type: HookTypes): boolean {
    return Array.isArray(this.hooks[type]) && this.hooks[type].length > 0;
  }

  public getHooks(type: HookTypes): ObservableInput<NavigationPayload>[] {
    return Array.isArray(this.hooks[type]) ? this.hooks[type] : [];
  }

  public clearHook(type: HookTypes): void {
    if (Array.isArray(this.hooks[type])) {
      delete this.hooks[type];
    }
  }

  public clearHooks(): void {
    this.hooks = {};
  }
}
