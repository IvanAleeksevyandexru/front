export interface ChildrenClubsValue {
  someKey: string;
}

export interface ChildrenClubsState {
  selectedProgramUUID: string;
  someFilters: {
    [key: string]: string;
  };
}
