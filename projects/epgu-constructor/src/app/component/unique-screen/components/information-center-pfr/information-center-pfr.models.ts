import { ListElement } from 'epgu-lib/lib/models/dropdown.model';
import { UniqueScreenComponentTypes } from '../../unique-screen-components.types';
import { DictionaryItem } from '../../../../shared/services/dictionary/dictionary-api.types';
import { SopOptions } from '../../../../shared/services/sop/sop.types';

export enum PfrAreaType {
  region = 'region',
  district = 'district',
  territory = 'territory',
  cityDistrict = 'cityDistrict',
}

export interface PftAreaTypeParams extends SopOptions {
  label: string;
}

export interface Simple {
  items: Array<DictionaryItem | ListElement>;
  label: string;
  html: string;
}

export interface InformationCenterPfrAttrs {
  full: Full;
  simple: Simple;
}

export interface InformationCenterPfr {
  id: string;
  type: UniqueScreenComponentTypes;
  label: string;
  value: string;
  attrs: InformationCenterPfrAttrs;
}

export interface SelectEvent {
  value?: ListElement;
  type: PfrAreaType;
  options: SopOptions;
}

export interface FormChangeEvent {
  value: {
    [PfrAreaType.territory]: ListElement;
  };
  isValid: boolean;
}

export type Full = { [key in PfrAreaType]: PftAreaTypeParams };

export type CachedValue = { [key in PfrAreaType]: ListElement };
