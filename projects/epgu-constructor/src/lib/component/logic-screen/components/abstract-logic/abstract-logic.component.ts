import { Component, Input, OnInit, Output } from '@angular/core';
import { LogicComponents } from '@epgu/epgu-constructor-types';
import { BehaviorSubject, Observable } from 'rxjs';
import { isOnBeforeSubmitComponent, isOnInitComponent } from '../helpers';

@Component({
  template: '',
})
export default abstract class AbstractLogicComponent implements OnInit {
  @Input() componentDto: LogicComponents;
  @Output() hasLoaded: BehaviorSubject<boolean>;

  ngOnInit(): void {
    if (this.componentDto) {
      if (isOnBeforeSubmitComponent(this.componentDto)) {
        this.handleOnBeforeSubmitEvent();
      }
      if (isOnInitComponent(this.componentDto)) {
        this.handleOnInitEvent().subscribe(() => {
          this.hasLoaded.next(true);
        });
      }
    }
  }

  protected abstract handleOnBeforeSubmitEvent(): void;

  protected abstract handleOnInitEvent(): Observable<{}>;
}
