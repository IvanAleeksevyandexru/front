import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { AppStateQuery } from '@epgu/epgu-constructor-ui-kit';
import { ChildrenClubsState, ChildrenClubsValue } from '../../children-clubs.types';

@Component({
  selector: 'children-clubs-filter-panel',
  templateUrl: './children-clubs-filter-panel.component.html',
  styleUrls: ['./children-clubs-filter-panel.component.scss', '../../../styles/index.scss'],
})
export class ChildrenClubsFilterPanelComponent implements OnInit {
  @Input() filtersCount: number;
  @Output() openFilters = new EventEmitter();
  @Output() search = new EventEmitter<string>();
  searchControl = new FormControl(this.query.state?.programFilters?.query ?? '');

  constructor(private query: AppStateQuery<ChildrenClubsValue, ChildrenClubsState>) {}
  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        filter((value) => value.length > 3 || !value.length),
        distinctUntilChanged(),
      )
      .subscribe((searchTxt) => this.search.next(searchTxt));
  }
}
