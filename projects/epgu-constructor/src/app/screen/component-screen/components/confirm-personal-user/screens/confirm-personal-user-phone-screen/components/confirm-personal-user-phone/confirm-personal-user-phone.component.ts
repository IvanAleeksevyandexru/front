import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CurrentAnswersService } from '../../../../../../../current-answers.service';
import { ScreenService } from '../../../../../../../screen.service';

// TODO удалить этот компонент в пользу CUSTOM SCREEN c поддержкой actions;
@Component({
  selector: 'epgu-constructor-confirm-personal-user-phone',
  templateUrl: './confirm-personal-user-phone.component.html',
  styleUrls: ['./confirm-personal-user-phone.component.scss'],
})
export class ConfirmPersonalUserPhoneComponent implements OnChanges {
  @Input() label: string;
  @Input() data: string;
  @Input() isEditButtonShown: boolean;

  phoneMask = [
    '+',
    '7',
    ' ',
    '(',
    /[1-9]/,
    /\d/,
    /\d/,
    ')',
    ' ',
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
  ];

  constructor(
    private currentAnswersService: CurrentAnswersService,
    private screenService: ScreenService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data?.currentValue) {
      this.currentAnswersService.state = this.data;
    }
  }
}
