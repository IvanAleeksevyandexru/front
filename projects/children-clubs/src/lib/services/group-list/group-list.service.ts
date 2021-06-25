import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { StateService } from '../state/state.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Group } from '../../typings';
import { distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';
import { isEqual } from 'lodash';
import { ChildrenClubsState } from '../../children-clubs.types';
import { DictionaryService } from '../dictionary/dictionary.service';

@Injectable()
export class GroupListService {
  loading$$ = new BehaviorSubject<boolean>(true);
  loading$ = this.loading$$.asObservable();

  page$$ = new BehaviorSubject<number>(0);
  isFinish$$ = new BehaviorSubject<boolean>(false);
  isFinish$ = this.isFinish$$.asObservable();
  pageSize = 10;

  allData$$ = new BehaviorSubject<Group[]>([]);

  data$$ = new BehaviorSubject<Group[]>([]);
  data$ = this.data$$.asObservable();

  get data(): Group[] {
    return this.data$$.getValue();
  }

  load$ = this.state.state$.pipe(
    distinctUntilChanged(
      (prev, next) =>
        isEqual(prev?.groupFilters, next?.groupFilters) &&
        prev.okato === next.okato &&
        prev.selectedProgramUUID === next.selectedProgramUUID,
    ),
    filter((state) => !!state.selectedProgramUUID),
    tap(() => this.reset()),
    switchMap((state: ChildrenClubsState) =>
      this.getGroupList(state).pipe(tap(() => this.loading$$.next(false))),
    ),
  );

  constructor(
    private api: ApiService,
    private state: StateService,
    private dictionary: DictionaryService,
  ) {}

  getGroupList(state: ChildrenClubsState): Observable<Group[]> {
    return this.api
      .getGroupList(state.selectedProgramUUID, this.state.groupFilters)
      .pipe(tap((data) => this.setGroupList(data)));
  }

  next(): void {
    const page = this.page$$.getValue() + 1;
    const data = this.allData$$.getValue();
    const size = page * this.pageSize;
    const length = data.length;
    let result: Group[] = [];
    if (size > length) {
      if (size - length > 0) {
        result = data.slice(size - this.pageSize, length);
      }
      this.isFinish$$.next(true);
    } else {
      result = data.slice(size - this.pageSize, size);
    }
    this.data$$.next(this.data$$.getValue().concat(result));
    this.page$$.next(page);
  }

  setGroupList(groupList: Group[]): void {
    this.allData$$.next(groupList);
    this.next();
  }

  resetPagination(): void {
    this.page$$.next(0);
  }

  reset(): void {
    this.loading$$.next(true);
    this.isFinish$$.next(false);
    this.resetPagination();
    this.data$$.next([]);
    this.allData$$.next([]);
  }
}
