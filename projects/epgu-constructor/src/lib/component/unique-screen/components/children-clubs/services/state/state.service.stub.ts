import { Injectable } from '@angular/core';
import { MicroAppStateQuery, MicroAppStateService } from '@epgu/epgu-constructor-ui-kit';
import { cloneDeep } from 'lodash';
import {
  ChildrenClubsValue,
  ChildrenClubsState,
  VendorType,
  Filters,
  FindOptionsGroup,
  GroupFiltersModes,
} from '../../models/children-clubs.types';

@Injectable()
export class StateServiceStub {
  state$ = this.stateQuery.state$;

  constructor(
    private appStateService: MicroAppStateService<ChildrenClubsValue, ChildrenClubsState>,
    private stateQuery: MicroAppStateQuery<ChildrenClubsValue, ChildrenClubsState>,
  ) {}

  changeState(state: Partial<ChildrenClubsState>): void {
    this.appStateService.updateState({ ...this.stateQuery.state, ...state });
  }

  clearGroupFilters(): void {
    const groupFilters = {};
    this.changeState({ groupFilters });
  }

  get vendor(): VendorType {
    return VendorType.inlearno;
  }

  get okato(): string {
    return '46434000000';
  }

  get nextSchoolYear(): boolean {
    return true;
  }

  get pageSize(): number {
    return 3;
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

  set programFilters(programFilters: Filters) {
    this.changeState({ programFilters });
  }

  get groupFilters(): FindOptionsGroup {
    return this.stateQuery.state?.groupFilters
      ? cloneDeep(this.stateQuery.state?.groupFilters)
      : ({ nextSchoolYear: this.nextSchoolYear, vendor: this.vendor } as FindOptionsGroup);
  }

  set groupFilters(groupFilters: FindOptionsGroup) {
    this.changeState({ groupFilters });
  }

  get groupFiltersMode(): GroupFiltersModes {
    return this.stateQuery.state?.groupFiltersMode;
  }

  set groupFiltersMode(groupFiltersMode: GroupFiltersModes) {
    this.changeState({ groupFiltersMode });
  }

  public initializeStateSynchronization(): void {
    return null;
  }
}
