import { DurationTimeTypes } from '../../../shared/constants/dates';
import { CustomComponentAttr, CustomComponentRef } from '../../../component/shared/components/components-list/components-list.types';

export interface Attrs extends CustomComponentAttr {
  limit?: string;
  to?: string;
  from?: string;
}

export interface Ref extends CustomComponentRef{
  relatedDate: string;
  val: string;
  period: DurationTimeTypes;
  condition: Operation;
}

export type DateRange = Date | null;
export type Range = { min: DateRange, max: DateRange };
export type Operation = '<' | '<=' | '>' | '>=' | '<today' | '<=today' | '>today' | '>=today';
