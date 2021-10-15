import { DurationTimeTypes } from '@epgu/epgu-constructor-ui-kit';
import { CustomComponentRef } from '../../../component/custom-screen/components-list.types';

export interface DateRangeAttrs {
  limit?: string;
  to?: string;
  from?: string;
}

export interface DateRangeRef extends CustomComponentRef {
  relatedDate: string;
  val: string;
  period: DurationTimeTypes;
  condition: Operation;
}

export type DateRange = Date | null;
export type Range = { min: DateRange; max: DateRange };
export type Operation = '<' | '<=' | '>' | '>=' | '<today' | '<=today' | '>today' | '>=today';
