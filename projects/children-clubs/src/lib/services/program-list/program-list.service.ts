import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { BaseProgram, Filters, FocusFilter } from '../../typings';
import {
  map,
  shareReplay,
  switchMap,
  tap,
  distinctUntilChanged,
  catchError,
  pluck,
} from 'rxjs/operators';
import { isEqual } from 'lodash';
import { ListElement } from '@epgu/epgu-lib';
import { StateService } from '../state/state.service';
import { GroupFiltersModes, ChildrenClubsValue, ChildrenClubsState } from '../../children-clubs.types';
import { MicroAppStateQuery } from '@epgu/epgu-constructor-ui-kit';

@Injectable()
export class ProgramListService {
  fullLoading$$ = new BehaviorSubject<boolean>(true);
  fullLoading$ = this.fullLoading$$.asObservable();
  get fullLoading(): boolean {
    return this.fullLoading$$.getValue();
  }
  loading$$ = new BehaviorSubject<boolean>(false);
  loading$ = this.loading$$.asObservable();
  get loading(): boolean {
    return this.loading$$.getValue();
  }
  page$$ = new BehaviorSubject<number>(0);
  isFinish$$ = new BehaviorSubject<boolean>(false);
  isFinish$ = this.isFinish$$.asObservable();
  get isFinish(): boolean {
    return this.isFinish$$.getValue();
  }
  pageSize = 3;

  autoScroll$$ = new BehaviorSubject<boolean>(false);
  get autoScroll(): boolean {
    return this.autoScroll$$.getValue();
  }
  set autoScroll(auto: boolean) {
    this.autoScroll$$.next(auto);
  }

  data$$ = new BehaviorSubject<BaseProgram[]>([]);
  data$ = this.data$$.asObservable();
  paginatedData$ = new BehaviorSubject<BaseProgram[]>([]);
  programFilters$ = new BehaviorSubject<Filters>({});

  public groupFiltersMode$: Observable<{
    isMap: boolean;
    isList: boolean;
  }> = this.appStateQuery.state$.pipe(
    pluck('groupFiltersMode'),
    map((mode) => {
      return {
        isMap: mode === GroupFiltersModes.map,
        isList: mode === GroupFiltersModes.list,
      };
    }),
    shareReplay(1),
  );

  get data(): BaseProgram[] {
    return this.data$$.getValue();
  }

  load$: Observable<BaseProgram[]> = this.stateService.state$.pipe(
    distinctUntilChanged(
      (prev, next) =>
        isEqual(prev?.programFilters, next?.programFilters) && prev.okato === next.okato,
    ),
    map((state) => this.processFilters(state)),
    tap(() => this.reset()),
    switchMap((options) =>
      this.api.getProgramList({
        ...options,
        page: 0,
        pageSize: 100000,
        okato: this.stateService.okato,
        vendor: this.stateService.vendor,
        nextSchoolYear: this.stateService.nextSchoolYear,
      }).pipe(
         catchError((_) => of([])),
         tap(() => this.loading$$.next(false)),
         tap((data: BaseProgram[]) => this.add(data))
       )
    ),
    shareReplay(1),
  );

  constructor(
    private api: ApiService,
    private stateService: StateService,
    private appStateQuery: MicroAppStateQuery<ChildrenClubsValue, ChildrenClubsState>,
  ) {}

  add(data: BaseProgram[]): void {
    if (this.data.length === 0) {
      this.fullLoading$$.next(false);
    }
    if (data.length <= this.pageSize) {
      this.finish();
    }
    this.data$$.next([...this.data].concat(data));
    this.getNextPage();
  }

  isLoaded(): boolean {
    return false;
  }

  finish(): void {
    this.isFinish$$.next(true);
  }

  getNextPage(): void {
    const page = this.page$$.getValue() + 1;
    const data = this.data$$.getValue();
    const size = page * this.pageSize;
    const length = data.length;
    let result: BaseProgram[];
    if (size > length) {
      result = data.slice(size - this.pageSize, length);
      this.isFinish$$.next(true);
    } else {
      result = data.slice(size - this.pageSize, size);
    }
    this.paginatedData$.next(this.paginatedData$.getValue().concat(result));
    this.page$$.next(page);
  }

  resetPagination(): void {
    this.page$$.next(0);
    this.paginatedData$.next([]);
  }

  reset(): void {
    this.autoScroll = false;
    this.isFinish$$.next(false);
    this.resetPagination();
    this.fullLoading$$.next(true);
    this.data$$.next([]);
  }

  processFilters(state: ChildrenClubsState): { filters: Filters } {
    const filters = { ...(state?.programFilters ?? {}) };
    const focus = filters?.focus as ListElement;
    if (focus && focus.id) {
      filters.focus = focus.id as FocusFilter;
    } else {
      delete filters.focus;
    }
    const place = filters?.municipality as ListElement;
    if (place && place?.id) {
      filters.municipality = place?.id as string;
    }
    const direction = filters?.direction as ListElement;
    if (direction && direction?.id) {
      filters.direction = direction?.id as string;
    } else {
      delete filters.direction;
    }
    if (filters?.query?.length === 0) {
      delete filters.query;
    }
    this.programFilters$.next(filters);
    return { filters };
  }
}
