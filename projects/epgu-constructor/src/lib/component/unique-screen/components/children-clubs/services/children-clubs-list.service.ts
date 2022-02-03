import { Injectable, Injector } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { DictionaryApiService } from '../../../../../shared/services/dictionary/dictionary-api.service';
import { StateService } from './state/state.service';
import ListPaginationService from '../../../../../shared/services/pagination-service/list-pagination.service';

@Injectable()
export default abstract class ChildrenClubsListService<T, U> extends ListPaginationService<T> {
  protected apiService: DictionaryApiService;

  protected stateService: StateService;

  protected _args: unknown;

  protected abstract refetchSubscribtion: Observable<U>;

  constructor(protected injector: Injector) {
    super(injector);
    this.apiService = injector.get(DictionaryApiService);
    this.stateService = injector.get(StateService);
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

  protected abstract processFilters(value): U;

  protected abstract fetchData(filters: U): Observable<T[]>;
}
