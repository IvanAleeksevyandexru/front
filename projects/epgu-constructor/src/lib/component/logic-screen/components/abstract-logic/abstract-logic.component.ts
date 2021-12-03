import { Component, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { LogicComponents } from '@epgu/epgu-constructor-types';
import {
  isOnInitComponent,
  isOnBeforeSubmitComponent,
  isOnBeforeRejectComponent,
} from '../helpers';

@Component({
  template: '',
})
export default abstract class AbstractLogicComponent implements OnInit {
  @Input() componentDto: LogicComponents;
  @Output() hasLoaded: BehaviorSubject<boolean>;

  ngOnInit(): void {
    if (this.componentDto) {
      if (isOnInitComponent(this.componentDto)) {
        this.handleFetchEvent().subscribe(() => {
          this.hasLoaded.next(true);
        });
      }
      if (isOnBeforeSubmitComponent(this.componentDto)) {
        this.handleOnBeforeSubmitEvent();
      }
      if (isOnBeforeRejectComponent(this.componentDto)) {
        this.handleOnBeforeRejectEvent();
      }
    }
  }

  protected abstract handleFetchEvent(): Observable<{}>;

  protected abstract handleOnBeforeSubmitEvent(): void;

  protected abstract handleOnBeforeRejectEvent(): void;
}
