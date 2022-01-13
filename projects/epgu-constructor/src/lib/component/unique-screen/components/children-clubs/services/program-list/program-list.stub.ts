import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { BaseProgram, Filters } from '../../models/children-clubs.types';

@Injectable()
export class ProgramListServiceStub {
  public fullLoading$$ = new BehaviorSubject<boolean>(true);

  public fullLoading$ = this.fullLoading$$.asObservable();

  public get fullLoading(): boolean {
    return this.fullLoading$$.getValue();
  }

  public loading$$ = new BehaviorSubject<boolean>(false);

  public loading$ = this.loading$$.asObservable();

  public get loading(): boolean {
    return this.loading$$.getValue();
  }

  public page$$ = new BehaviorSubject<number>(0);

  public isFinish$$ = new BehaviorSubject<boolean>(false);

  public isFinish$ = this.isFinish$$.asObservable();

  public get isFinish(): boolean {
    return this.isFinish$$.getValue();
  }

  public pageSize: number;

  public autoScroll$$ = new BehaviorSubject<boolean>(false);

  public get autoScroll(): boolean {
    return this.autoScroll$$.getValue();
  }

  public set autoScroll(auto: boolean) {
    this.autoScroll$$.next(auto);
  }

  public data$$ = new BehaviorSubject<BaseProgram[]>([]);

  public data$ = this.data$$.asObservable();

  public paginatedData$ = new BehaviorSubject<BaseProgram[]>([]);

  public programFilters$ = new BehaviorSubject<Filters>({});

  public isFilterPanelExpanded$ = new BehaviorSubject<boolean>(true);

  public groupFiltersMode$: Observable<{
    isMap: boolean;
    isList: boolean;
  }> = of({
    isMap: true,
    isList: false,
  });

  public load$: Observable<null> = of(null);

  public selectProgram = (uuid: string) => of(uuid);
}
