import { Injectable } from '@angular/core';
import { CachedAnswers } from '../../../screen/screen.types';
import { ComponentDto } from '../../../form-player/services/form-player-api/form-player-api.types';
import { UniqueScreenComponentTypes } from '../../../component/unique-screen/unique-screen-components.types';

// TODO нужно утащить на backend (HARDCODE from backend)
export const componentsNoCache: Array<string> = [
  UniqueScreenComponentTypes.carInfo,
];

@Injectable()
export class CachedAnswersService {
  getCachedValueById(answers: CachedAnswers, id: string) {
    return answers[id]?.value;
  }

  // TODO нужно утащить на backend (HARDCODE from backend)
  shouldBeTakenFromTheCache(component: ComponentDto) {
    return !componentsNoCache.includes(component.type);
  }
}
