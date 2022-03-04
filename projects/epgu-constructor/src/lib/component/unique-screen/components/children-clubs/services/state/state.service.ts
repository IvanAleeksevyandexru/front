import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import {
  CfAppStateService,
  LocalStorageService,
  MicroAppStateQuery,
  MicroAppStateService,
} from '@epgu/epgu-constructor-ui-kit';
import {
  ChildrenClubsState,
  ChildrenClubsValue,
  Filters,
  FindOptionsGroup,
  GroupFiltersModes,
  VendorType,
} from '../../models/children-clubs.types';
import { DataDirectionType, InputAppDto, MicroAppState } from '@epgu/epgu-constructor-types';

@Injectable()
export class StateService {
  state$ = this.stateQuery.state$;

  public inputAppData: InputAppDto;

  public isLoaderVisible$: Observable<boolean> = this.stateQuery.state$.pipe(
    pluck('isLoaderVisible'),
  );

  private stateSynchronizationEnabled = false;

  constructor(
    private appStateService: MicroAppStateService<ChildrenClubsValue, ChildrenClubsState>,
    private stateQuery: MicroAppStateQuery<ChildrenClubsValue, ChildrenClubsState>,
    private cfAppStateService: CfAppStateService,
    private localStorageService: LocalStorageService,
  ) {}

  initializeStateSynchronization(): void {
    if (!this.stateSynchronizationEnabled) {
      this.setInputAppData();
      this.initializeAppState();
      this.enableStorageSynchronization();
      this.stateSynchronizationEnabled = true;
    }
  }

  changeState(state: Partial<ChildrenClubsState>): void {
    this.appStateService.updateState({ ...this.stateQuery.state, ...state });
  }

  get vendor(): VendorType {
    return this.stateQuery.state?.vendor;
  }

  get pageSize(): number {
    return +this.stateQuery.state?.pageSize || 10;
  }

  get okato(): string {
    return this.stateQuery.state?.okato;
  }

  get mapOptions(): string {
    return this.stateQuery.state?.mapOptions;
  }

  get addressString(): string {
    return this.stateQuery.state?.addressString;
  }

  get nextSchoolYear(): boolean {
    return this.stateQuery.state?.nextSchoolYear === 'true';
  }

  get selectedProgramUUID(): string {
    return this.stateQuery.state?.selectedProgramUUID;
  }

  set selectedProgramUUID(selectedProgramUUID: string) {
    this.changeState({ selectedProgramUUID });
  }

  get programFilters(): Filters {
    return this.stateQuery.state?.programFilters
      ? cloneDeep(this.stateQuery.state?.programFilters)
      : {};
  }

  set programFilters(filters: Filters) {
    const programFilters = { ...this.programFilters, ...filters };
    this.changeState({ programFilters });
  }

  get groupFilters(): FindOptionsGroup {
    const defaultFindOptions: FindOptionsGroup = {
      nextSchoolYear: this.nextSchoolYear,
      vendor: this.vendor,
      isRegistrationOpen: this.programFilters.isRegistrationOpen,
      maxPrice: this.programFilters.maxPrice,
      age: this.programFilters.age,
      inlearnoPayments: this.programFilters.inlearnoPayments,
    };
    if (
      !this.stateQuery.state?.groupFilters ||
      Object.keys(this.stateQuery.state?.groupFilters).length === 0
    ) {
      return defaultFindOptions;
    }
    return cloneDeep(this.stateQuery.state?.groupFilters);
  }

  set groupFilters(filters: FindOptionsGroup) {
    const groupFilters = { ...this.groupFilters, ...filters };
    this.changeState({ groupFilters });
  }

  get groupFiltersMode(): GroupFiltersModes {
    return this.stateQuery.state?.groupFiltersMode;
  }

  set groupFiltersMode(groupFiltersMode: GroupFiltersModes) {
    this.changeState({ groupFiltersMode });
  }

  get isLoaderVisible(): boolean {
    return this.stateQuery.state?.isLoaderVisible;
  }

  set isLoaderVisible(isLoaderVisible: boolean) {
    this.changeState({ isLoaderVisible });
  }

  clearGroupFilters(): void {
    const groupFilters = {};
    this.changeState({ groupFilters });
  }

  private setInputAppData(): void {
    this.inputAppData = this.cfAppStateService.getState<InputAppDto>(DataDirectionType.INPUT);
  }

  private initializeAppState(): void {
    const stateFromStorage = this.getStateFromLocalStorage();
    let initState: MicroAppState<ChildrenClubsValue, ChildrenClubsState>;

    if (stateFromStorage && this.inputAppData?.orderId === stateFromStorage.orderId) {
      initState = stateFromStorage;
    } else {
      try {
        initState = JSON.parse(this.inputAppData.value) as MicroAppState<
          ChildrenClubsValue,
          ChildrenClubsState
        >;
        if (this.inputAppData?.healthPayload) {
          initState.healthPayload = this.inputAppData.healthPayload;
        }

        initState.orderId = this.inputAppData.orderId;

        if (!initState.value) {
          initState.value = {} as ChildrenClubsValue;
        }

        if (!initState.state) {
          initState.state = {} as ChildrenClubsState;
        }
      } catch (_) {
        throw new Error(
          `Looks like we have some issues. We can't parse string: "${this.inputAppData.value}"`,
        );
      }
    }
    this.appStateService.initialize(initState);
  }

  private getStateFromLocalStorage(): MicroAppState<ChildrenClubsValue, ChildrenClubsState> {
    const key = this.getStorageKey();
    let stateFromStorage;

    try {
      stateFromStorage = this.localStorageService.get<
        MicroAppState<ChildrenClubsValue, ChildrenClubsState>
      >(key);
    } catch (_) {
      stateFromStorage = null;
    }

    return stateFromStorage;
  }

  private getStorageKey(): string {
    return `APP_STORAGE_${this.inputAppData.componentType.toUpperCase()}_${this.inputAppData.componentId.toUpperCase()}`;
  }

  private enableStorageSynchronization(): void {
    const key = this.getStorageKey();
    this.stateQuery.store$.subscribe((storeState) => {
      this.localStorageService.set<MicroAppState<ChildrenClubsValue, ChildrenClubsState>>(
        key,
        storeState,
      );
    });
  }
}
