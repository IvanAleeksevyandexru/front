import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { AppNavigationService } from '@epgu/epgu-constructor-ui-kit';

// TODO: remove it when moved to real components
@Component({
  selector: 'children-clubs-test1',
  template:
    '<h1>test1 {{ key1 }}</h1><div class="mt-24"><button (click)="prev()">Prev Out</button><button (click)="next()" class="btn--primary">Next component</button></div>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Test1Component implements OnInit {
  key1 = 'Some value 1';
  constructor(private appNavigationService: AppNavigationService) {}

  next(): void {
    this.appNavigationService.next();
  }

  prev(): void {
    this.appNavigationService.prev();
  }

  ngOnInit(): void {
    this.key1 = 'Some value 1 onInit';
  }
}
