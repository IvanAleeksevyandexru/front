import { Injectable } from '@angular/core';
import { CachedAnswers } from '../../../screen/screen.types';
import { UniqueScreenComponentTypes } from '../../../component/unique-screen/unique-screen-components.types';
import { ComponentScreenComponentTypes } from '../../../component/component-screen/component-screen-components.types';

// TODO нужно утащить на backend (HARDCODE from backend)
export const componentsNoCache: Array<string> = [
  UniqueScreenComponentTypes.carInfo,
  ComponentScreenComponentTypes.confirmPersonalUserPhone,
  ComponentScreenComponentTypes.confirmPersonalUserEmail,
  UniqueScreenComponentTypes.paymentScr,
  ComponentScreenComponentTypes.timeSlot,
];

@Injectable()
export class CachedAnswersService {
  getCachedValueById(answers: CachedAnswers, id: string): string | null{
    return answers[id]?.value || null;
  }

  // TODO нужно утащить на backend (HARDCODE from backend)
  shouldBeTakenFromTheCache(type: string): boolean {
    return !componentsNoCache.includes(type);
  }
}
