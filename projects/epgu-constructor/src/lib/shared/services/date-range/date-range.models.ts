// @ts-ignore
import { DurationTimeTypes } from '@epgu/epgu-constructor-ui-kit';
import {
  CustomComponentAttr,
  CustomComponentRef,
} from '../../../component/custom-screen/components-list.types';

export interface DateRangeAttrs extends CustomComponentAttr {
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
