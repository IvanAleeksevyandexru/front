import { Injectable } from '@angular/core';
import { AppStateService } from '../app-state/app-state.service';
import { AppRouterState } from '@epgu/epgu-constructor-types';
import { AppStateQuery } from '../app-state/app-state.query';
import { AppNavigationRuleService } from '../app-navigation-rule/app-navigation-rule.service';
import { EventBusService } from '../../core/services/event-bus/event-bus.service';

@Injectable()
export class AppNavigationService {
  constructor (
    private appStateService: AppStateService<unknown, AppRouterState>,
    private appStateQuery: AppStateQuery<unknown, AppRouterState>,
    private appNavigationRuleService: AppNavigationRuleService,
    private eventBusService: EventBusService,
  ) {}

  public next(): void {
    const next = this.appNavigationRuleService.getNext();
    if (next) {
      this.navigate(next);
    } else {
      this.eventBusService.emit('closeApp', false);
    }
  }

  public prev(): void {
    debugger;
    const prev = this.appNavigationRuleService.getPrev();
    if (prev) {
      this.navigate(prev);
    } else {
      this.eventBusService.emit('closeApp', true);
    }
  }

  private navigate(newComponent: string): void {
    const currentState = this.appStateQuery.state;
    this.appStateService.updateState({ ...currentState, currentComponent: newComponent });
  }
}
