import { ListElement } from 'epgu-lib/lib/models/dropdown.model';
import { UniqueScreenComponentTypes } from '../../unique-screen-components.types';

export enum PfrAreaType {
  region = 'region',
  district = 'district',
  territory = 'territory',
}

export interface PftAreaTypeParams {
  label: string;
  attributeName: string;
  condition: string;
}

export interface Simple {
  items: Array<ListElement>;
  label: string;
  html: string;
}

export interface InformationCenterPfrAttrs {
  full: Full;
  simple: Simple;
  dictionaryType: string;
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
  attributeName: string;
  condition: string;
}

export interface FormChangeEvent {
  value: unknown;
  isValid: boolean;
}

export type Full = { [key in PfrAreaType]: PftAreaTypeParams };

export type CachedValue = { [key in PfrAreaType]: ListElement };
