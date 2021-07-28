import { CustomComponentRef } from '../../../component/custom-screen/components-list.types';
import { DateRangeRef } from '../../services/date-range/date-range.models';
import { ComponentDictionaryFilterDto } from '@epgu/epgu-constructor-types';

export default interface IDropDownDeptsAttrs {
  dictionaryType?: string;
  lockedValue?: boolean;
  repeatWithNoFilters?: boolean;
  dictionaryFilter?: ComponentDictionaryFilterDto[];
  secondaryDictionaryFilter?: ComponentDictionaryFilterDto[];
  ref?: Array<CustomComponentRef | DateRangeRef>;
  defaultIndex?: number;
}
