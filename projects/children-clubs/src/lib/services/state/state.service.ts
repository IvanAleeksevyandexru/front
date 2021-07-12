import { Injectable } from '@angular/core';
import { Filters, FindOptionsGroup, VendorType } from '../../typings';
import { AppStateQuery, AppStateService } from '@epgu/epgu-constructor-ui-kit';
import { ChildrenClubsState, ChildrenClubsValue, GroupFiltersModes } from '../../children-clubs.types';
import { cloneDeep } from 'lodash';

@Injectable()
export class StateService {
  state$ = this.stateQuery.state$;

  constructor(
    private appStateService: AppStateService<ChildrenClubsValue, ChildrenClubsState>,
    private stateQuery: AppStateQuery<ChildrenClubsValue, ChildrenClubsState>,
  ) {}

  changeState(state: Partial<ChildrenClubsState>): void {
    this.appStateService.updateState({ ...this.stateQuery.state, ...state });
  }

  get vendor(): VendorType {
    return this.stateQuery.state.vendor;
  }

  get okato(): number {
    return +this.stateQuery.state.okato;
  }

  get nextSchoolYear(): boolean {
    return this.stateQuery.state.nextSchoolYear === 'true';
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
    return this.stateQuery.state?.groupFilters
      ? cloneDeep(this.stateQuery.state?.groupFilters)
      : ({ nextSchoolYear: this.nextSchoolYear, vendor: this.vendor } as FindOptionsGroup);
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

  clearGroupFilters(): void {
    const groupFilters = {};
    this.changeState({ groupFilters });
  }
}
