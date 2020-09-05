import { Injectable } from '@angular/core';
import { ApplicantAnswers } from '../../../services/api/form-player-api/form-player-api.types';


@Injectable()
export class ApplicantAnswersService {
  getAnsweredValueById(answers: ApplicantAnswers, id: string) {
    return answers[id]?.value;
  }
}
