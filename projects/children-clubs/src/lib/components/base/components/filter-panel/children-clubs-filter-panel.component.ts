import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  ConfigService,
  MicroAppStateQuery,
  MicroAppStateService,
} from '@epgu/epgu-constructor-ui-kit';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
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
  @Input() title = 'Введите название группы, ФИО педагога, или адрес проведения занятий';
  @Input() showNav = false;
  @Input() showMap = true;
  @Output() openFilters = new EventEmitter();
  @Output() search = new EventEmitter<string>();

  searchControl = new FormControl('');

  public GroupFiltersModes = GroupFiltersModes;

  constructor(
    public programListService: ProgramListService,
    public config: ConfigService,
    private query: MicroAppStateQuery<ChildrenClubsValue, ChildrenClubsState>,
    private appStateService: MicroAppStateService<ChildrenClubsValue, ChildrenClubsState>,
  ) {}
  ngOnInit(): void {
    if (this.initValue) {
      this.searchControl.setValue(this.initValue);
    }
    this.searchControl.valueChanges
      .pipe(
        filter((value) => value.length > 3 || !value.length),
        distinctUntilChanged(),
        debounceTime(2000),
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
