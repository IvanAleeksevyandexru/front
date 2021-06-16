import { AppRouterState } from '@epgu/epgu-constructor-types';

export interface ChildrenClubsValue {
  someKey: string
}

export interface ChildrenClubsState extends AppRouterState{
  someFilters: {
    [key: string]: string
  }
}
