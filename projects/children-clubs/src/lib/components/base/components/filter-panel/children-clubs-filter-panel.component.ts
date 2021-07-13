import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AppStateQuery, AppStateService } from '@epgu/epgu-constructor-ui-kit';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import {
  ChildrenClubsState,
  ChildrenClubsValue,
  GroupFiltersModes,
} from '../../../../children-clubs.types';
import { ProgramListService } from '../../../../services/program-list/program-list.service';

@Component({
  selector: 'children-clubs-filter-panel',
  templateUrl: './children-clubs-filter-panel.component.html',
  styleUrls: ['./children-clubs-filter-panel.component.scss', '../../../../../styles/index.scss'],
})
export class ChildrenClubsFilterPanelComponent implements OnInit {
  @Input() filtersCount: number;
  @Input() initValue: string;
  @Input() isShowMenu = true;
  @Input() title = 'Введите адрес проведения занятий, ФИО педагога, название группы';
  @Input() showNav = false;
  @Input() showMap = true;
  @Output() openFilters = new EventEmitter();
  @Output() search = new EventEmitter<string>();

  searchControl = new FormControl('');

  public GroupFiltersModes = GroupFiltersModes;

  constructor(
    public programListService: ProgramListService,
    private query: AppStateQuery<ChildrenClubsValue, ChildrenClubsState>,
    private appStateService: AppStateService<ChildrenClubsValue, ChildrenClubsState>,
  ) {}
  ngOnInit(): void {
    if (this.initValue) {
      this.searchControl.setValue(this.initValue);
    }
    this.searchControl.valueChanges
      .pipe(
        filter((value) => value.length > 3 || !value.length),
        distinctUntilChanged(),
      )
      .subscribe((searchTxt) => this.search.next(searchTxt));
  }

  public setGroupFiltersMode(mode: GroupFiltersModes): void {
    this.appStateService.updateState({
      ...this.query.state,
      groupFiltersMode: mode,
    });
  }
}
