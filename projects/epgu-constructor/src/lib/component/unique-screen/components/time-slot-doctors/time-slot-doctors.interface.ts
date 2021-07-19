import { ComponentAttrsDto, ComponentDto } from '@epgu/epgu-constructor-types';
import { ComponentValue } from '../../../../shared/services/dictionary/dictionary-tools.service';

export interface TimeSlotDoctorsComponent extends ComponentDto {
  attrs: TimeSlotDoctorsAttrs;
  parsedValue: ComponentValue;
}

export interface TimeSlotDoctorsAttrs extends ComponentAttrsDto {
  specLookup: ComponentAttrsDto;
  docLookup: ComponentAttrsDto;
  ts: ComponentAttrsDto;
}
