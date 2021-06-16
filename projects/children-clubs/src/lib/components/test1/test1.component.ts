import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AppNavigationService } from '@epgu/epgu-constructor-ui-kit';

// TODO: remove it when moved to real components
@Component({
  selector: 'children-clubs-test1',
  template:
    '<h1>test1</h1><button (click)="prev()">Prev Out</button><button (click)="next()">Next component</button>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Test1Component {
  constructor(private appNavigationService: AppNavigationService) {}

  next(): void {
    this.appNavigationService.next();
  }

  prev(): void {
    this.appNavigationService.prev();
  }
}
