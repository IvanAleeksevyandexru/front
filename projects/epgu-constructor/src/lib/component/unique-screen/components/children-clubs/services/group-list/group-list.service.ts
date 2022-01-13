import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Group, FindOptionsGroup } from '../../models/children-clubs.types';
import { DictionaryApiService } from '../../../../../../shared/services/dictionary/dictionary-api.service';

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

  constructor(private dictionaryApiService: DictionaryApiService) {}

  public getGroupList(uuid: string, groupFilters: FindOptionsGroup): Observable<Group[]> {
    if (groupFilters?.query?.length === 0) {
      delete groupFilters.query;
    }
    return this.dictionaryApiService.getGroupList(uuid, groupFilters).pipe(
      catchError((_) => of([])),
      tap((data) => this.setGroupList(data)),
      tap(() => this.loading$$.next(false)),
    );
  }

  // TODO: сервисы GroupListService и ProgramListService во многом похожи, подумать над объединением
  public next(): void {
    const page = this.page$$.getValue() + 1;
    const data = this.allData$$.getValue();
    const size = page * this.pageSize;
    const { length } = data;
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

  public reset(): void {
    this.loading$$.next(true);
    this.isFinish$$.next(false);
    this.resetPagination();
    this.data$$.next([]);
    this.allData$$.next([]);
  }

  private setGroupList(groupList: Group[]): void {
    this.allData$$.next(groupList);
    this.next();
  }

  private resetPagination(): void {
    this.page$$.next(0);
  }
}
