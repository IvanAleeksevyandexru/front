import { Injectable } from '@angular/core';
import { AppStateService } from '../app-state/app-state.service';
import { AppNavigationRuleService } from '../app-navigation-rule/app-navigation-rule.service';
import { EventBusService } from '../../core/services/event-bus/event-bus.service';

@Injectable()
export class AppNavigationService {
  constructor (
    private appStateService: AppStateService<unknown, unknown>,
    private appNavigationRuleService: AppNavigationRuleService,
    private eventBusService: EventBusService,
  ) {}

  public next(): void {
    const next = this.appNavigationRuleService.getNext();
    if (next) {
      this.appStateService.updateCurrentComponent(next);
    } else {
      this.eventBusService.emit('closeApp', false);
    }
  }

  public prev(): void {
    const prev = this.appNavigationRuleService.getPrev();
    if (prev) {
      this.appStateService.updateCurrentComponent(prev);
    } else {
      this.eventBusService.emit('closeApp', true);
    }
  }
}
