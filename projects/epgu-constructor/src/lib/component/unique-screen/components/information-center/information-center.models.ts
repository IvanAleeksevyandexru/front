import { ListElement } from '@epgu/ui/models/dropdown';
import { DictionaryConditions } from '@epgu/epgu-constructor-types';
import { UniqueScreenComponentTypes } from '../../unique-screen-components.types';
import { DictionaryItem } from '../../../../shared/services/dictionary/dictionary-api.types';

export enum PfrAreaType {
  region = 'region',
  district = 'district',
  territory = 'territory',
  cityDistrict = 'cityDistrict',
}

export interface PftAreaTypeParams {
  label: string;
  attributeName: string;
  condition: DictionaryConditions;
}

export interface Simple {
  items: (DictionaryItem | ListElement)[];
  label: string;
  html: string;
}

export interface InformationCenterAttrs {
  full: Full;
  simple: Simple;
  dictionaryType: string;
}

export interface InformationCenterPfr {
  id: string;
  type: UniqueScreenComponentTypes;
  label: string;
  value: string;
  attrs: InformationCenterAttrs;
}

export interface SelectEvent {
  value?: ListElement;
  type: PfrAreaType;
  attributeName: string;
  condition: DictionaryConditions;
}

export interface FormChangeEvent {
  value: {
    [PfrAreaType.territory]: ListElement;
  };
  isValid: boolean;
}

export type Full = { [key in PfrAreaType]: PftAreaTypeParams };

export type CachedValue = { [key in PfrAreaType]: ListElement };
