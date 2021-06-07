import { Component, ChangeDetectionStrategy } from '@angular/core';
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

  constructor(private listService: ProgramListService) {
    this.fetchItems();
  }

  fetchItems(): void {
    this.listService.fetchList().subscribe((container) => {
      this.addItemsToList(container);
    });
  }

  addItemsToList(list: List): void {
    this.list$.next(this.list$.getValue().concat(list));
  }
}
