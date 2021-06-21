import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ListElement } from '@epgu/epgu-lib';
import { takeUntil } from 'rxjs/operators';
import {
  AppStateQuery,
  AppStateService,
  ModalService,
  UnsubscribeService,
} from '@epgu/epgu-constructor-ui-kit';
import { ProgramListService } from '../program-list.service';
import { BaseProgram, Filters } from '../../../typings';
import { ProgramFiltersFormComponent } from '../../program-filters/components/program-filters-form.component';
import { ChildrenClubsState, ChildrenClubsValue } from '../../../children-clubs.types';

@Component({
  selector: 'children-clubs-program-list',
  templateUrl: './program-list-container.component.html',
  styleUrls: ['./program-list-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class ProgramListContainerComponent implements OnInit {
  fullLoading$: Observable<boolean> = this.listService.fullLoading$;
  filtersCount$$ = new BehaviorSubject<number>(0);
  filtersCount$ = this.filtersCount$$.asObservable();
  data$: Observable<BaseProgram[]> = this.listService.data$;

  constructor(
    private modalService: ModalService,
    private listService: ProgramListService,
    private ngUnsubscribe$: UnsubscribeService,
    private appStateService: AppStateService<ChildrenClubsValue, ChildrenClubsState>,
    private stateQuery: AppStateQuery<ChildrenClubsValue, ChildrenClubsState>,
  ) {}

  fetchItems(): void {
    this.listService.getNextPage();
  }

  getProgramFilters(): Filters {
    return { ...(this.stateQuery.state?.programFilters ?? {}) };
  }

  search(text: string): void {
    const programFilters = this.getProgramFilters();
    programFilters.query = text;
    this.appStateService.updateState({ ...this.stateQuery.state, programFilters });
  }
  countingFilters(filters: Filters): void {
    let count = 0;
    if (!filters) {
      return;
    }
    const finded = Object.entries(filters).filter(
      ([key, value]) =>
        value !== null &&
        value !== 'null' &&
        value !== 'all' &&
        value !== false &&
        value !== undefined &&
        key !== 'inlernoPayments' &&
        key !== 'place' &&
        key !== 'query' &&
        key !== 'focus',
    );
    count += finded.length;

    if ((filters?.place as ListElement)?.text) {
      count += 1;
    }
    const focus = (filters?.focus as ListElement)?.id;
    if (focus !== 'null') {
      count += 1;
    }
    count += Object.entries(filters.inlernoPayments).filter((value) => value[1]).length;
    this.filtersCount$$.next(count);
  }
  openFilter(): void {
    this.modalService.openModal<Filters>(ProgramFiltersFormComponent).subscribe((filters) => {
      this.countingFilters(filters);
      const programFilters = { ...this.getProgramFilters(), ...filters };
      this.appStateService.updateState({ ...this.stateQuery.state, programFilters });
    });
  }

  ngOnInit(): void {
    this.countingFilters(this.stateQuery.state?.programFilters);
    this.listService.load$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe();
  }
}
