import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { BaseProgram, FocusFilter } from '../../typings';
import {
  map,
  shareReplay,
  switchMap,
  tap,
  filter,
  concatMap,
  mapTo,
  distinctUntilChanged,
} from 'rxjs/operators';
import { isEqual } from 'lodash';
import { ListElement } from '@epgu/epgu-lib';
import { StateService } from '../state/state.service';

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

  get data(): BaseProgram[] {
    return this.data$$.getValue();
  }

  load$: Observable<void> = this.stateService.state$.pipe(
    distinctUntilChanged(
      (prev, next) =>
        isEqual(prev?.programFilters, next?.programFilters) && prev.okato === next.okato,
    ),
    map((state) => {
      const filters = { ...(state?.programFilters ?? {}) };
      const focus = filters?.focus as ListElement;
      if (focus && focus?.id) {
        filters.focus = focus.id as FocusFilter;
      }
      const place = filters?.municipality as ListElement;
      if (place && place?.id) {
        filters.municipality = place?.id as string;
      }
      const direction = filters?.direction as ListElement;
      if (direction && direction?.id) {
        filters.direction = direction?.id as string;
      }
      if (filters?.query?.length === 0) {
        delete filters.query;
      }
      return { filters };
    }),
    tap(() => this.reset()),
    switchMap((options) =>
      this.page$$.pipe(
        distinctUntilChanged(),
        filter((page) => !this.isFinish && (page + 1) * this.pageSize > this.data.length),
        concatMap((page) => {
          this.loading$$.next(true);
          return this.api
            .getProgramList({
              ...options,
              page,
              pageSize: this.pageSize,
              okato: this.stateService.okato,
              vendor: this.stateService.vendor,
              nextSchoolYear: this.stateService.nextSchoolYear,
            })
            .pipe(
              tap(() => this.loading$$.next(false)),
              tap((data: BaseProgram[]) => this.add(data)),
            );
        }),
        mapTo(null),
      ),
    ),
    shareReplay(1),
  );

  constructor(private api: ApiService, private stateService: StateService) {}

  add(data: BaseProgram[]): void {
    if (this.data.length === 0) {
      this.fullLoading$$.next(false);
    }
    if (data.length < this.pageSize) {
      this.finish();
    }
    this.data$$.next([...this.data].concat(data));
  }

  isLoaded(): boolean {
    return false;
  }

  finish(): void {
    this.isFinish$$.next(true);
  }

  getNextPage(): void {
    if (!this.isFinish && !this.loading$$.getValue()) {
      this.page$$.next(this.page$$.getValue() + 1);
    }
  }

  resetPagination(): void {
    this.page$$.next(0);
  }

  reset(): void {
    this.autoScroll = false;
    this.isFinish$$.next(false);
    this.resetPagination();
    this.fullLoading$$.next(true);
    this.data$$.next([]);
  }
}
