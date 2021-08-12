import { Component, OnInit } from '@angular/core';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ScreenService } from '../../../../screen/screen.service';

@Component({
  selector: 'epgu-constructor-person-user-inn',
  templateUrl: './person-user-inn.component.html',
})
export class PersonUserInnComponent implements OnInit {
  constructor(
    public currentAnswersService: CurrentAnswersService,
    public screenService: ScreenService,
  ) {}

  ngOnInit(): void {}
}
