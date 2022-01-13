import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  BaseComponent,
  ConfigService,
  MicroAppStateQuery,
  MicroAppStateService,
} from '@epgu/epgu-constructor-ui-kit';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import {
  GroupFiltersModes,
  ChildrenClubsValue,
  ChildrenClubsState,
} from '../../../../models/children-clubs.types';
import { ProgramListService } from '../../../../services/program-list/program-list.service';

@Component({
  selector: 'epgu-constructor-cc-filter-panel',
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.scss', '../../../../../../../../../styles/index.scss'],
})
export class FilterPanelComponent extends BaseComponent implements OnInit {
  @Input() filtersCount: number;
  @Input() initValue: string;
  @Input() isShowMenu = true;
  @Input() title = 'Введите название группы, ФИО педагога, или адрес проведения занятий';
  @Input() showNav = false;
  @Output() openFilters = new EventEmitter();
  @Output() search = new EventEmitter<string>();

  searchControl = new FormControl('');

  public GroupFiltersModes = GroupFiltersModes;

  constructor(
    public programListService: ProgramListService,
    public config: ConfigService,
    private query: MicroAppStateQuery<ChildrenClubsValue, ChildrenClubsState>,
    private appStateService: MicroAppStateService<ChildrenClubsValue, ChildrenClubsState>,
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.initValue) {
      this.searchControl.setValue(this.initValue);
    }
    this.searchControl.valueChanges
      .pipe(
        filter((value) => value.length >= 3 || !value.length),
        distinctUntilChanged(),
        debounceTime(500),
      )
      .subscribe((searchTxt) => this.search.next(searchTxt));
  }

  public setGroupFiltersMode(mode: GroupFiltersModes): void {
    this.appStateService.updateState({
      ...this.query.state,
      groupFiltersMode: mode,
    });
  }

  public expand(): void {
    this.programListService.isFilterPanelExpanded$.next(
      !this.programListService.isFilterPanelExpanded$.getValue(),
    );
  }
}
