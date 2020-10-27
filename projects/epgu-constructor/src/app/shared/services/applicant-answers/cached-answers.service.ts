import { Injectable } from '@angular/core';
import { CachedAnswers } from '../../../screen/screen.types';
import { ComponentDto } from '../../../services/api/form-player-api/form-player-api.types';
import { UniqueScreenComponentTypes } from '../../../screen/unique-screen/unique-screen.types';

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
