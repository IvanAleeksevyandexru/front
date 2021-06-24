import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { FilterPanelStorageService } from '../filter-panel-storage.service';

@Component({
  selector: 'children-clubs-list',
  template: `
    <children-clubs-filter-panel
      (search)="search($event)"
      (openFilters)="openFilters()"
    ></children-clubs-filter-panel>
  `,
})
export class ListComponent implements OnInit {
  constructor(private filterPanelStorage: FilterPanelStorageService) {}

  openFilters(): void {
    of([]).subscribe(() => {
      this.filterPanelStorage.save({ filter: 'test' });
      this.getList();
    });
  }

  ngOnInit(): void {
    this.filterPanelStorage.reset();
  }

  search(txt: string): void {
    this.filterPanelStorage.save({ search: txt });
    this.getList();
  }

  getList(): void {
    // TODO: доделать, а пока закоментил, чтобы линтер не ругался
    // const params = this.filterPanelStorage.get();
    // console.log(params);
  }
}
