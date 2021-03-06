import { ComponentDto } from '@epgu/epgu-constructor-types';
import BaseModel from './BaseModel';
import GenericAttrs from './GenericAttrs';
import { CUSTOM_SCREEN_MODELS } from './custom-screen-models.const';

export default function createModel(componentDTO: ComponentDto): BaseModel<GenericAttrs> {
  if (CUSTOM_SCREEN_MODELS[componentDTO.type]) {
    return new CUSTOM_SCREEN_MODELS[componentDTO.type](componentDTO);
  }
}
