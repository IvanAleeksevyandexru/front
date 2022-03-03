import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';

@Injectable()
export default class ListPaginationService<T> {
  protected _initSize = 3;

  protected _pageSize = 10;

  protected isLoading = new BehaviorSubject(false);

  protected isFinished = new BehaviorSubject(false);

  protected ngUnsubscribe$: UnsubscribeService;

  private paginatedData: BehaviorSubject<T[]> = new BehaviorSubject([]);

  private fullData: BehaviorSubject<T[]> = new BehaviorSubject([]);

  private currentPage = 0;

  constructor(protected injector: Injector) {
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

  public set initSize(size: number) {
    this._initSize = +size;
  }

  public set pageSize(size: number) {
    this._pageSize = +size;
  }

  public nextPage(): void {
    const newCurrentPage = this.currentPage + 1;
    const data = this.fullData.getValue();
    const size = newCurrentPage * this._pageSize;
    const { length } = data;
    let result = [];
    if (size > length) {
      if (size - length > 0) {
        result = data.slice(this.paginatedData.getValue().length);
      }
      this.isFinished.next(true);
    } else {
      result = data.slice(
        this.paginatedData.getValue().length,
        this._initSize + this.currentPage * this._pageSize,
      );
    }
    this.paginatedData.next(this.paginatedData.getValue().concat(result));
    this.currentPage = newCurrentPage;
  }

  public resetData(): void {
    this.isLoading.next(true);
    this.isFinished.next(false);
    this.currentPage = 0;
    this.fullData.next([]);
    this.paginatedData.next([]);
  }

  public setData(data): void {
    if (data.length <= this._pageSize) {
      this.isFinished.next(true);
    }
    this.fullData.next(data);

    this.nextPage();
  }
}
