import { CustomComponentAttr, CustomComponentRef } from '../../../component/components-list/components-list.types';
import { DurationInputArg2 } from 'moment';

export interface Attrs extends CustomComponentAttr {
  limit?: string;
  to?: string;
  from?: string;
}

export interface Ref extends CustomComponentRef{
  relatedDate: string;
  val: string;
  period: DurationInputArg2;
  condition: string;
}

export type DateRange = Date | null;
export type Range = { min: DateRange, max: DateRange };
