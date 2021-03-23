import { ComponentDictionaryFilterDto } from '../../../form-player/services/form-player-api/form-player-api.types';
import { CustomComponentRef } from '../components-list/components-list.types';
import { DateRangeRef } from '../../services/date-range/date-range.models';

export default interface IDropDownDeptsAttrs {
  dictionaryType?: string;
  lockedValue?: boolean;
  repeatWithNoFilters?: boolean;
  dictionaryFilter?: Array<ComponentDictionaryFilterDto>;
  secondaryDictionaryFilter?: Array<ComponentDictionaryFilterDto>;
  ref?: Array<CustomComponentRef | DateRangeRef>;
  defaultIndex?: number;
}
