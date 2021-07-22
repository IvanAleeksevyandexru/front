import { ComponentAttrsDto, ComponentDto } from '@epgu/epgu-constructor-types';
import { ComponentValue } from '../../../../shared/services/dictionary/dictionary-tools.service';
import { ListElement } from '@epgu/epgu-lib';

export interface TimeSlotDoctorsComponent extends ComponentDto {
  attrs: TimeSlotDoctorsAttrs;
  parsedValue: ComponentValue;
}

export interface TimeSlotDoctorsAttrs extends ComponentAttrsDto {
  specLookup: ComponentAttrsDto;
  docLookup: ComponentAttrsDto;
  ts: ComponentAttrsDto;
}

export interface TimeSlotDoctorState {
  specLookup: ListElement;
  docLookup: ListElement;
}
