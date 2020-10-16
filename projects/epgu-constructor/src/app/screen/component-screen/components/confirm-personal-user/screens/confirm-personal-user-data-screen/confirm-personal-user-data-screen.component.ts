import { Component, Input, OnInit } from '@angular/core';
import { CurrentAnswersService } from '../../../../../current-answers.service';
import { ConfirmUserData } from '../../../../types/confirm-user-data.types';

@Component({
  selector: 'epgu-constructor-confirm-personal-user-data-screen',
  templateUrl: './confirm-personal-user-data-screen.component.html',
  styleUrls: ['./confirm-personal-user-data-screen.component.scss'],
})
export class ConfirmPersonalUserDataScreenComponent implements OnInit {
  constructor(private currentAnswersService: CurrentAnswersService) {}

  propData: ConfirmUserData;
  @Input() set data(val: ConfirmUserData) {
    this.propData = val;
    const { value } = val;
    this.currentAnswersService.state = value;
  }
  @Input() errors: object;
  @Input() applicantAnswers: object = {};

  ngOnInit(): void {}
}
