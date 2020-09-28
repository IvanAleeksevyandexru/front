import { Injectable } from '@angular/core';
import { CachedAnswers } from '../../../screen/screen.types';


@Injectable()
export class CachedAnswersService {
  getCachedValueById(answers: CachedAnswers, id: string) {
    return answers[id]?.value;
  }
}
