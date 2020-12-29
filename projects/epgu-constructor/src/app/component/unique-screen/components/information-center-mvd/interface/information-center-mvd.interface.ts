import { UniqueScreenComponentTypes } from '../../../unique-screen-components.types';
import { ComponentActionDto } from '../../../../../form-player/services/form-player-api/form-player-api.types';
import { DepartmentInterface } from '../../time-slots/time-slots.types';
import { DictionaryItem } from '../../../../shared/services/dictionary-api/dictionary-api.types';

export interface InformationCenterMvdI {
  id: string;
  type: UniqueScreenComponentTypes;
  label: string;
  value: string;
  required: boolean;
  valueFromCache: boolean;
  attrs: InformationCenterMvdAttrI;
}

interface InformationCenterMvdAttrI {
  sourceDictionary: SourceDictionaryI;
  dictionaryToRequest: DictionaryToRequestI;
  actions: ComponentActionDto[];
}

interface SourceDictionaryI{
  type: string;
  label: string;
  text: string;
  hint: string;
}

export interface DictionaryToRequestI{
  type: string;
  label: string;
  text: string;
  hint: string;
}

export interface MvdInfoCanterInterface extends DictionaryItem{
  attributeValues: {
    CODE: string;
    ADDRESS: string;
    FULLNAME: string;
    PHONE: string;
  };
}
