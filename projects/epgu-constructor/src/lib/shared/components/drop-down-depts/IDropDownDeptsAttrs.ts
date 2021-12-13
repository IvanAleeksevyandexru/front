import { ComponentDictionaryFilterDto } from '@epgu/epgu-constructor-types';
import { CustomComponentRef } from '../../../component/custom-screen/components-list.types';
import { DateRangeRef } from '../../services/date-range/date-range.models';

export default interface IDropDownDeptsAttrs {
  dictionaryType?: string;
  lockedValue?: boolean;
  repeatWithNoFilters?: boolean;
  dictionaryFilter?: ComponentDictionaryFilterDto[];
  secondaryDictionaryFilter?: ComponentDictionaryFilterDto[];
  ref?: (CustomComponentRef | DateRangeRef)[];
  defaultIndex?: number;
}
