import { Injectable } from '@angular/core';
import { ApplicantAnswers } from '../../../screen/screen.types';


@Injectable()
export class ApplicantAnswersService {
  getAnsweredValueById(answers: ApplicantAnswers, id: string) {
    return answers[id]?.value;
  }
}
