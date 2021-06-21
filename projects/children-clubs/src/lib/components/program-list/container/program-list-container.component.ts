import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { takeUntil } from 'rxjs/operators';
import { AppStateQuery, AppStateService, UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { ProgramListService } from '../program-list.service';
import { BaseProgram, Filters } from '../../../typings';
import { ApiService } from '../../../services/api/api.service';
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

  data$: Observable<BaseProgram[]> = this.listService.data$;

  constructor(
    private listService: ProgramListService,
    private api: ApiService,
    private ngUnsubscribe$: UnsubscribeService,
    private query: AppStateQuery<ChildrenClubsValue, ChildrenClubsState>,
    private appStateService: AppStateService<ChildrenClubsValue, ChildrenClubsState>,
  ) {}
  changeFilter(): void {
    const programFilters: Filters = this.query.state?.programFilters ?? {};
    this.appStateService.updateState({
      ...this.query.state,
      programFilters: { ...programFilters, maxPrice: 1 - 0.5 + Math.random() * (10 - 1 + 1) },
    });
  }

  fetchItems(): void {
    this.listService.getNextPage();
  }

  ngOnInit(): void {
    this.listService.load$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe();
  }
}
