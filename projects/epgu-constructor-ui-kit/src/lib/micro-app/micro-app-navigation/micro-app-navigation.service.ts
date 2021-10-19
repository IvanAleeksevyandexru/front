import { Injectable } from '@angular/core';

import { MicroAppStateService } from '../micro-app-state/micro-app-state.service';
import { MicroAppNavigationRuleService } from '../micro-app-navigation-rule/micro-app-navigation-rule.service';
import { EventBusService } from '../../core/services/event-bus/event-bus.service';
import { BusEventType } from '../../core/services/event-bus/event-bus.service.interface';

@Injectable({ providedIn: 'root' })
export class MicroAppNavigationService {
  constructor(
    private appStateService: MicroAppStateService<unknown, unknown>,
    private appNavigationRuleService: MicroAppNavigationRuleService,
    private eventBusService: EventBusService,
  ) {}

  public next(): void {
    const next = this.appNavigationRuleService.getNext();
    if (next) {
      this.appStateService.updateCurrentComponent(next);
    } else {
      this.eventBusService.emit(BusEventType.CloseApp, false);
    }
  }

  public prev(): void {
    const prev = this.appNavigationRuleService.getPrev();
    if (prev) {
      this.appStateService.updateCurrentComponent(prev);
    } else {
      this.eventBusService.emit(BusEventType.CloseApp, true);
    }
  }

  public toDisplay(display: string): void {
    this.appStateService.updateCurrentComponent(display);
  }
}
