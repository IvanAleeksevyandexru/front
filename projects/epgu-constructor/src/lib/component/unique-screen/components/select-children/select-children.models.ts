import { ListElement } from '@epgu/ui/models/dropdown';

export enum ItemStatus {
  invalid = 'INVALID',
  valid = 'VALID',
}

export interface ChildI extends Partial<ListElement> {
  controlId?: string;
  isNewRef?: string;
}

export interface ClearEvent {
  isClear: boolean;
  id?: string;
}

export type CachedValue = { [key: string]: string }[] | null;
