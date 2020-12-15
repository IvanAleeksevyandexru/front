import { Injectable } from '@angular/core';
import { CachedAnswers } from '../../../screen/screen.types';
import { ComponentDto } from '../../../form-player/services/form-player-api/form-player-api.types';
import { UniqueScreenComponentTypes } from '../../../component/unique-screen/unique-screen-components.types';
import { ComponentScreenComponentTypes } from '../../../component/component-screen/component-screen-components.types';

// TODO нужно утащить на backend (HARDCODE from backend)
export const componentsNoCache: Array<string> = [
  UniqueScreenComponentTypes.carInfo,
  ComponentScreenComponentTypes.confirmPersonalUserPhone,
  ComponentScreenComponentTypes.confirmPersonalUserEmail,
  UniqueScreenComponentTypes.paymentScr,
];

@Injectable()
export class CachedAnswersService {
  getCachedValueById(answers: CachedAnswers, id: string): string {
    return answers[id]?.value;
  }

  // TODO нужно утащить на backend (HARDCODE from backend)
  shouldBeTakenFromTheCache(component: ComponentDto): boolean {
    return !componentsNoCache.includes(component.type);
  }
}
