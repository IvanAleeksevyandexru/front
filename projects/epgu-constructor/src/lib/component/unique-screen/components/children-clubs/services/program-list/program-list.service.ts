import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {
  map,
  shareReplay,
  switchMap,
  tap,
  distinctUntilChanged,
  catchError,
  pluck,
  filter,
} from 'rxjs/operators';
import { isEqual } from 'lodash';
import { MicroAppStateQuery } from '@epgu/epgu-constructor-ui-kit';
import { ListElement } from '@epgu/ui/models/dropdown';
import { StateService } from '../state/state.service';
import {
  BaseProgram,
  Filters,
  GroupFiltersModes,
  ChildrenClubsValue,
  ChildrenClubsState,
  FocusFilter,
  FindOptionsProgram,
} from '../../models/children-clubs.types';
import { ScreenService } from '../../../../../../screen/screen.service';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { ActionService } from '../../../../../../shared/directives/action/action.service';
import { NEXT_STEP_ACTION } from '../../../../../../shared/constants/actions';
import { DictionaryApiService } from '../../../../../../shared/services/dictionary/dictionary-api.service';

@Injectable()
export class ProgramListService {
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

  public data$ = this.data$$.pipe(filter((val) => !!val.length));

  public paginatedData$ = new BehaviorSubject<BaseProgram[]>([]);

  public programFilters$ = new BehaviorSubject<Filters>({});

  public isFilterPanelExpanded$ = new BehaviorSubject<boolean>(true);

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

  public get data(): BaseProgram[] {
    return this.data$$.getValue();
  }

  public load$: Observable<BaseProgram[]> = this.stateService.state$.pipe(
    distinctUntilChanged(
      (prev, next) =>
        isEqual(prev?.programFilters, next?.programFilters) && prev.okato === next.okato,
    ),
    map((state) => this.processFilters(state)),
    tap(() => this.reset()),
    switchMap((options: FindOptionsProgram) => {
      options = { ...options, ...this.screenService.component?.arguments };
      return this.dictionaryApiService
        .getProgramList({
          ...options,
          page: 0,
          pageSize: 100000,
        })
        .pipe(
          catchError((_) => of([])),
          tap(() => this.loading$$.next(false)),
          tap((data: BaseProgram[]) => this.add(data)),
        );
    }),
    shareReplay(1),
  );

  constructor(
    private dictionaryApiService: DictionaryApiService,
    private stateService: StateService,
    private appStateQuery: MicroAppStateQuery<ChildrenClubsValue, ChildrenClubsState>,
    private screenService: ScreenService,
    private currentAnswersService: CurrentAnswersService,
    private actionService: ActionService,
  ) {
    this.pageSize = (this.screenService.component?.arguments?.pageSize as number) || 10;
  }

  public isLoaded(): boolean {
    return false;
  }

  public getNextPage(): void {
    const page = this.page$$.getValue() + 1;
    const data = this.data$$.getValue();
    const size = page * this.pageSize;
    const { length } = data;
    let result: BaseProgram[];
    if (size >= length) {
      result = data.slice(size - this.pageSize, length);
      this.isFinish$$.next(true);
    } else {
      result = data.slice(size - this.pageSize, size);
    }
    this.paginatedData$.next(this.paginatedData$.getValue().concat(result));
    this.page$$.next(page);
  }

  public selectProgram(uuid): void {
    const componentId = this.screenService.component.id;

    this.currentAnswersService.isValid = true;
    this.currentAnswersService.state = JSON.stringify({ uuid });

    this.actionService.switchAction(NEXT_STEP_ACTION, componentId);
  }

  private add(data: BaseProgram[]): void {
    if (this.data.length === 0) {
      this.fullLoading$$.next(false);
    }
    if (data.length <= this.pageSize) {
      this.finish();
    }
    this.data$$.next([...this.data].concat(data));
    this.getNextPage();
  }

  private finish(): void {
    this.isFinish$$.next(true);
  }

  private resetPagination(): void {
    this.page$$.next(0);
    this.paginatedData$.next([]);
  }

  private reset(): void {
    this.autoScroll = false;
    this.isFinish$$.next(false);
    this.resetPagination();
    this.fullLoading$$.next(true);
    this.data$$.next([]);
  }

  private processFilters(state: ChildrenClubsState): { filters: Filters } {
    const filters = { ...(state?.programFilters ?? {}) };
    const focus = filters?.focus as ListElement;
    if (focus && focus.id && focus.id !== 'empty-item') {
      filters.focus = focus.id as FocusFilter;
    } else {
      delete filters.focus;
    }
    const place = filters?.municipality as ListElement;
    if (place && place?.id && place.id !== 'empty-item') {
      filters.municipality = place?.id as string;
    }
    const direction = filters?.direction as ListElement;
    if (direction && direction?.id && direction.id !== 'empty-item') {
      filters.direction = direction?.id as string;
    } else {
      delete filters.direction;
    }
    if (filters?.query?.length === 0) {
      delete filters.query;
    }
    Object.keys(filters).forEach((key) => {
      if (filters[key] === 'empty-item') {
        filters[key] = null;
      }
    });
    this.programFilters$.next(filters);
    return { filters };
  }
}
