import { UniqueScreenComponentTypes } from '../../../unique-screen-components.types';
import { ComponentActionDto, ComponentDictionaryFilterDto } from 'epgu-constructor-types';

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

export interface SourceDictionaryI {
  type: string;
  label: string;
  text: string;
  hint: string;
  dictionaryFilter?: Array<ComponentDictionaryFilterDto>;
}

export interface DictionaryToRequestI {
  type: string;
  label: string;
  text: string;
  hint: string;
  dictionaryFilter?: Array<ComponentDictionaryFilterDto>;
}

export interface MvdInfoCenterI {
  title: string;
  attributeValues: {
    CODE: string;
    ADDRESS: string;
    FULLNAME: string;
    PHONE: string;
  };
}
