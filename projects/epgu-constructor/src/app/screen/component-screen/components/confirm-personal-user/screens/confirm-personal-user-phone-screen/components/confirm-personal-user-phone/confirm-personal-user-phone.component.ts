import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CurrentAnswersService } from '../../../../../../../current-answers.service';
import { ScreenService } from '../../../../../../../screen.service';

// TODO удалить этот компонент в пользу CUSTOM SCREEN c поддержкой actions;
@Component({
  selector: 'epgu-constructor-confirm-personal-user-phone',
  templateUrl: './confirm-personal-user-phone.component.html',
  styleUrls: ['./confirm-personal-user-phone.component.scss'],
})
export class ConfirmPersonalUserPhoneComponent implements OnInit, OnChanges {
  @Input() label: string;
  @Input() data: string;

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
    public screenService: ScreenService,
  ) {}

  ngOnInit(): void {
    if (!this.data) {
      this.currentAnswersService.isValid = false;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data?.currentValue) {
      this.currentAnswersService.state = this.data;
    }
  }
}
