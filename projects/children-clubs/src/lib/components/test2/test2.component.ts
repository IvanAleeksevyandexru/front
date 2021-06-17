import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { AppNavigationService } from '@epgu/epgu-constructor-ui-kit';

// TODO: remove it when moved to real components
@Component({
  selector: 'children-clubs-test2',
  template:
    '<h1>test2 {{key2}}</h1><button (click)="prev()">Prev component</button><button (click)="next()">Next out</button>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Test2Component implements OnInit {
  key2 = 'Some value 2';
  constructor(private appNavigationService: AppNavigationService) {}

  prev(): void {
    this.appNavigationService.prev();
  }

  next(): void {
    this.appNavigationService.next();
  }

  ngOnInit(): void {
    this.key2 = 'Some value 2 onInit';
  }
}
