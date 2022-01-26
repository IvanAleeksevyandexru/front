import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { DictionaryApiService } from '../../../../../shared/services/dictionary/dictionary-api.service';
import { StateService } from './state/state.service';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';

@Injectable()
export default abstract class BaseListService<T, U> {
  protected apiService: DictionaryApiService;

  protected stateService: StateService;

  protected _args: unknown;

  protected pageSize = 10;

  protected isLoading = new BehaviorSubject(false);

  protected isFinished = new BehaviorSubject(false);

  private currentPage = 0;

  private ngUnsubscribe$: UnsubscribeService;

  private paginatedData: BehaviorSubject<T[]> = new BehaviorSubject([]);

  private fullData: BehaviorSubject<T[]> = new BehaviorSubject([]);

  protected abstract refetchSubscribtion: Observable<U>;

  constructor(protected injector: Injector) {
    this.apiService = injector.get(DictionaryApiService);
    this.stateService = injector.get(StateService);
    this.ngUnsubscribe$ = injector.get(UnsubscribeService);
  }

  get isLoading$(): Observable<boolean> {
    return this.isLoading.asObservable();
  }

  get isFinished$(): Observable<boolean> {
    return this.isFinished.asObservable();
  }

  get paginatedData$(): Observable<T[]> {
    return this.paginatedData.asObservable();
  }

  get fullData$(): Observable<T[]> {
    return this.fullData.asObservable();
  }

  set args(args: unknown) {
    this._args = args;
  }

  public subscribeOnFiltersChange(): void {
    this.refetchSubscribtion.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((value) => {
      const filters = this.processFilters(value);
      this.resetData();
      this.fetchData(filters)
        .pipe(
          catchError((_) => of([])),
          tap(() => this.isLoading.next(false)),
          tap((data: T[]) => this.setData(data)),
        )
        .subscribe();
    });
  }

  public nextPage(): void {
    const newCurrentPage = this.currentPage + 1;
    const data = this.fullData.getValue();
    const size = newCurrentPage * this.pageSize;
    const { length } = data;
    let result = [];
    if (size > length) {
      if (size - length > 0) {
        result = data.slice(size - this.pageSize, length);
      }
      this.isFinished.next(true);
    } else {
      result = data.slice(size - this.pageSize, size);
    }
    this.paginatedData.next(this.paginatedData.getValue().concat(result));
    this.currentPage = newCurrentPage;
  }

  protected resetData(): void {
    this.isLoading.next(true);
    this.isFinished.next(false);
    this.currentPage = 0;
    this.fullData.next([]);
    this.paginatedData.next([]);
  }

  protected setData(data): void {
    if (data.length <= this.pageSize) {
      this.isFinished.next(true);
    }
    this.fullData.next(data);

    this.nextPage();
  }
  protected abstract processFilters(value): U;

  protected abstract fetchData(filters: U): Observable<T[]>;
}
