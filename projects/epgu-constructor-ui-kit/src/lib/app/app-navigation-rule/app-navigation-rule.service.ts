import { Injectable } from '@angular/core';
import { AppNavigationRuleMap } from './app-navigation-rule';
import { AppStateQuery } from '../app-state/app-state.query';

@Injectable()
export class AppNavigationRuleService {

  private appNavigationRuleMap: AppNavigationRuleMap;

  constructor (private appStateQuery: AppStateQuery<unknown, unknown>) {}

  public initRule(appNavigationRuleMap: AppNavigationRuleMap): void {
    this.appNavigationRuleMap = appNavigationRuleMap;
  }

  public getFirst(): string {
    const entries = Object.entries(this.appNavigationRuleMap);

    for (const item in entries) {
      const [name] = entries[item];
      if (!entries.some(([_, { next }]) => next === name)) {
        return name;
      }
    }

    throw new Error(
      `Looks like we have some issues.
       Can't find first component`,
    );
  }

  public getLast(): string {
    const entries = Object.entries(this.appNavigationRuleMap);

    for (const item in entries) {
      const [name, value] = entries[item];
      if (value.next === undefined) {
        return name;
      }
    }

    throw new Error(
      `Looks like we have some issues.
       Can't find last component`,
    );
  }

  public getNext(): string {
    const current = this.appStateQuery.currentComponent;
    return this.appNavigationRuleMap[current].next;
  }

  public getPrev(): string {
    const current = this.appStateQuery.currentComponent;
    let prev;
    const entries = Object.entries(this.appNavigationRuleMap);

    for (const item in entries) {
      const [name, { next }] = entries[item];
      if (next === current) {
        prev = name;
      }
    }

    return prev;
  }
}
