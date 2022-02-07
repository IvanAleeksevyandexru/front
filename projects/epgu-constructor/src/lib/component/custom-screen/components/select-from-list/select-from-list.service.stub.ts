import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable()
export class SelectFromListServiceStub {
  public paginatedData$: Observable<unknown> = new BehaviorSubject([]);

  public isFinished$: Observable<unknown>;

  protected refetchSubscribtion: Observable<unknown>;

  private _pageSize: number;

  nextPage(): void {
    return null;
  }

  public setData(data): void {
    return null;
  }

  public resetData(): void {
    return null;
  }

  public set pageSize(size: number) {
    this._pageSize = size;
  }

  protected fetchData(): Observable<null> {
    return of(null);
  }

  protected processFilters(): void {
    return null;
  }
}
