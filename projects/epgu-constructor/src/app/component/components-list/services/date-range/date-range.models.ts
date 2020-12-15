import { DurationInputArg2 } from 'moment';
import { CustomComponentAttr, CustomComponentRef } from '../../components-list.types';

export interface Attrs extends CustomComponentAttr {
  limit?: string;
  to?: string;
  from?: string;
}

export interface Ref extends CustomComponentRef{
  relatedDate: string;
  val: string;
  period: DurationInputArg2;
  condition: Operation;
}

export type DateRange = Date | null;
export type Range = { min: DateRange, max: DateRange };
export type Operation = '<' | '<=' | '>' | '>=' | '<today' | '<=today' | '>today' | '>=today';
