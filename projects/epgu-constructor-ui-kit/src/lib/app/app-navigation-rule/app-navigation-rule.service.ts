import { Injectable } from '@angular/core';
import { AppNavigationRuleMap } from './app-navigation-rule';
import { AppStateQuery } from '../app-state/app-state.query';
import { AppRouterState } from '@epgu/epgu-constructor-types';

@Injectable()
export class AppNavigationRuleService {

  private appNavigationRuleMap: AppNavigationRuleMap;

  constructor (private appStateQuery: AppStateQuery<unknown, AppRouterState>) {}

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
      const [name] = entries[item];
      if (entries.some(([_, { next }]) => next === undefined)) {
        return name;
      }
    }

    throw new Error(
      `Looks like we have some issues.
       Can't find last component`,
    );
  }

  public getNext(): string {
    const current = this.getCurrent();
    return this.appNavigationRuleMap[current].next;
  }

  public getPrev(): string {
    const current = this.getCurrent();
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

  private getCurrent(): string {
    return this.appStateQuery.state.currentComponent;
  }
}
