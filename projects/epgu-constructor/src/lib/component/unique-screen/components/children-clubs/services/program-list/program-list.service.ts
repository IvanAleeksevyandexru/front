import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, shareReplay, distinctUntilChanged, pluck } from 'rxjs/operators';
import { isEqual } from 'lodash';
import { MicroAppStateQuery } from '@epgu/epgu-constructor-ui-kit';
import { ListElement } from '@epgu/ui/models/dropdown';
import {
  BaseProgram,
  Filters,
  GroupFiltersModes,
  ChildrenClubsValue,
  ChildrenClubsState,
  FocusFilter,
  VendorType,
} from '../../models/children-clubs.types';
import { ScreenService } from '../../../../../../screen/screen.service';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { ActionService } from '../../../../../../shared/directives/action/action.service';
import { NEXT_STEP_ACTION } from '../../../../../../shared/constants/actions';
import ChildrenClubsListService from '../children-clubs-list.service';

@Injectable()
export class ProgramListService extends ChildrenClubsListService<BaseProgram, Filters> {
  public autoScroll$$ = new BehaviorSubject<boolean>(false);

  public get autoScroll(): boolean {
    return this.autoScroll$$.getValue();
  }

  public set autoScroll(auto: boolean) {
    this.autoScroll$$.next(auto);
  }

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

  protected _args: { nextSchoolYear: boolean; vendor: VendorType; okato: string };

  protected refetchSubscribtion = this.stateService.state$.pipe(
    distinctUntilChanged(
      (prev, next) =>
        isEqual(prev?.programFilters, next?.programFilters) && prev.okato === next.okato,
    ),
    pluck('programFilters'),
  );

  get disableAutoscroll(): boolean {
    return this.isFinished.getValue() || this.isLoading.getValue();
  }

  constructor(
    protected injector: Injector,
    private appStateQuery: MicroAppStateQuery<ChildrenClubsValue, ChildrenClubsState>,
    private screenService: ScreenService,
    private currentAnswersService: CurrentAnswersService,
    private actionService: ActionService,
  ) {
    super(injector);
    this._pageSize = (this.screenService.component?.arguments?.pageSize as number) || 10;
  }

  public selectProgram(uuid): void {
    const componentId = this.screenService.component.id;

    this.currentAnswersService.isValid = true;
    this.currentAnswersService.state = JSON.stringify({ uuid });

    this.actionService.switchAction(NEXT_STEP_ACTION, componentId);
  }

  protected fetchData(filters: Filters): Observable<BaseProgram[]> {
    return this.apiService.getProgramList({
      ...this._args,
      filters,
      page: 0,
      pageSize: 100000,
    });
  }

  protected processFilters(filters: Filters = {}): Filters {
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
    return filters;
  }
}
