import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ProgramListService } from '../program-list.service';
import { List } from '../program-list.models';

@Component({
  selector: 'children-clubs-program-list',
  templateUrl: './program-list-container.component.html',
  styleUrls: ['./program-list-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgramListContainerComponent {
  list$ = new BehaviorSubject<List>([]);
  list: List = [];

  constructor(private cdr: ChangeDetectorRef, private listService: ProgramListService) {
    this.fetchItems('init');
    // setInterval(() => {
    //   this.fetchItems('init');
    // }, 4000)
  }

  fetchItems(event: string): void {
    console.log(event);
    this.addItemsToList(this.listService.mockFetchList());
    // this.listService.fetchList().subscribe((container) => {
    //   this.addItemsToList(container);
    // this.perfectScroll.directiveRef.update();

    // this.cdr.detectChanges();
    // });
  }

  addItemsToList(list: List): void {
    this.list$.next([...this.list$.getValue(), ...list]);
    // this.container = this.container.concat(container);
  }
}
